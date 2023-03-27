import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidContract} from './interfaces'
import {block} from './staticEntities'

export class ProcessorCodegen {
    private out: FileOutput

    private mappings = new Set<string>()
    private archiveRegistry = false

    constructor(
        private outDir: OutDir,
        private options: {
            archive: SquidArchive
            contracts: SquidContract[]
            dataTarget: DataTarget
            from?: number
        }
    ) {
        this.out = this.outDir.file(`processor.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`const processor = new SubstrateBatchProcessor()`)
        this.out.indentation(() => {
            this.out.line(`.setDataSource({`)
            this.out.indentation(() => {
                if (this.options.archive.kind === 'name') {
                    this.useArchiveRegistry()
                    this.out.line(`archive: lookupArchive('${this.options.archive.value}', {type: 'Substrate'}),`)
                } else {
                    this.out.line(`archive: '${this.options.archive.value}',`)
                }
            })
            this.out.line(`})`)
            this.printSubscribes()
        })
        this.out.line()
        let targetPrinter = this.getTargetPrinter()
        this.out.line(`processor.run(db, async (ctx: BatchContext<Store, any>) => {`)
        this.out.indentation(() => {
            targetPrinter.printPreBatch()
            this.out.block(`for (let {header: block, items} of ctx.blocks)`, () => {
                targetPrinter.printFragmentSave(block, [`block.id`, `block.height`, `new Date(block.timestamp)`])
                this.out.block(`for (let item of items)`, () => {
                    this.out.line()
                    this.out.block(
                        `if (item.kind == 'event' && item.event.name == 'Contracts.ContractEmitted')`,
                        () => {
                            for (let contract of this.options.contracts) {
                                this.out.block(`if (item.event.args.contract == ${contract.name}.address)`, () => {
                                    this.useMapping(contract.name)
                                    this.out.line(`${contract.name}.parse(block, item.event)`)
                                })
                            }
                        }
                    )
                })
            })
            targetPrinter.printPostBatch()
        })
        this.out.line(`})`)
        return this.out.write()
    }

    private printImports() {
        let targetPrinter = this.getTargetPrinter()
        this.out.lazy(() => {
            this.out.line(`import {SubstrateBatchProcessor, BatchContext} from '@subsquid/substrate-processor'`)
            if (this.archiveRegistry) {
                this.out.line(`import {lookupArchive} from '@subsquid/archive-registry'`)
            }
            if (this.mappings.size > 0) {
                this.out.line(
                    `import {${[...this.mappings].join(`, `)}} from '${resolveModule(
                        this.out.file,
                        path.resolve(`src`, `mapping`)
                    )}'`
                )
            }
            this.out.line(`import {db, Store} from '${resolveModule(this.out.file, path.resolve(`src`, `db`))}'`)
            targetPrinter.printImports()
        })
    }

    private printSubscribes() {
        for (let contract of this.options.contracts) {
            this.useMapping(contract.name)
            if (Object.keys(contract.events).length > 0) {
                this.out.line(`.addContractsContractEmitted(${contract.name}.address, {`)
                this.out.indentation(() => {
                    this.out.line(`data: {`)
                    this.out.indentation(() => {
                        this.out.line(`event: {args: true, extrinsic: {hash: true}}`)
                    })
                    this.out.line(`},`)
                })
                if (contract.range?.from || contract.range?.to) {
                    this.out.line(`range: {`)
                    this.out.indentation(() => {
                        if (contract.range?.from) {
                            this.out.line(`from: ${contract.range.from}`)
                        }
                        if (contract.range?.to) {
                            this.out.line(`to: ${contract.range.to}`)
                        }
                    })
                    this.out.line(`},`)
                }
                this.out.line(`})`)
            }
        }
    }

    private useArchiveRegistry() {
        this.archiveRegistry = true
    }

    private useMapping(str: string) {
        this.mappings.add(str)
    }

    @def
    private getTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.out)
    }
}
