import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidContract} from './interfaces'
import {block, transaction} from './staticEntities'

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
        this.out.line(`const processor = new EvmBatchProcessor()`)
        this.out.line(`processor.setDataSource({`)
        this.out.indentation(() => {
            if (this.options.archive.kind === 'name') {
                this.useArchiveRegistry()
                this.out.line(`archive: lookupArchive('${this.options.archive.value}', {type: 'EVM'}),`)
            } else {
                this.out.line(`archive: '${this.options.archive.value}',`)
            }
        })

        this.out.line(`})`)
        this.printSubscribes()
        this.out.line()
        let targetPrinter = this.getTargetPrinter()
        this.out.line(`processor.run(db, async (ctx: BatchHandlerContext<Store, any>) => {`)
        this.out.indentation(() => {
            targetPrinter.printPreBatch()
            this.out.block(`for (let {header: block, items} of ctx.blocks)`, () => {
                targetPrinter.printFragmentSave(block, [`block.id`, `block.height`, `new Date(block.timestamp)`])
                this.out.line(`let lastTxHash: string | undefined`)
                this.out.block(`for (let item of items)`, () => {
                    this.out.block(`if (item.transaction.hash != lastTxHash)`, () => {
                        this.out.line(`lastTxHash = item.transaction.hash`)
                        targetPrinter.printFragmentSave(transaction, [
                            `item.transaction.id`,
                            `block.height`,
                            `new Date(block.timestamp)`,
                            `item.transaction.hash`,
                            `item.transaction.to`,
                            `item.transaction.from`,
                            `item.transaction.success`,
                        ])
                    })

                    for (let contract of this.options.contracts) {
                        this.out.line()
                        this.out.block(`if (item.address === ${contract.name}.address)`, () => {
                            this.useMapping(contract.name)
                            this.out.line(`${contract.name}.parse(ctx, block, item)`)
                        })
                    }
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
            this.out.line(`import {EvmBatchProcessor, BatchHandlerContext} from '@subsquid/evm-processor'`)
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
                this.out.line(`processor.addLog(${contract.name}.address, {`)
                this.out.indentation(() => {
                    this.out.line(`filter: [`)
                    this.out.indentation(() => {
                        this.out.line(`[`)
                        this.out.indentation(() => {
                            for (let e in contract.events) {
                                this.out.line(`${contract.name}.spec.events['${e}'].topic,`)
                            }
                        })
                        this.out.line(`],`)
                    })
                    this.out.line(`],`)
                    this.out.line(`data: {`)
                    this.out.indentation(() => {
                        this.out.line(`evmLog: {`)
                        this.out.indentation(() => {
                            this.out.line(`topics: true,`)
                            this.out.line(`data: true,`)
                        })
                        this.out.line(`},`)
                        this.out.line(`transaction: {`)
                        this.out.indentation(() => {
                            this.out.line(`hash: true,`)
                            this.out.line(`from: true,`)
                        })
                        this.out.line(`},`)
                    })
                    this.out.line(`} as const,`)
                    if (contract.range != null && (contract.range.from != null || contract.range.to != null)) {
                        let range = contract.range
                        this.out.line(`range: {`)
                        this.out.indentation(() => {
                            this.out.line(`from: ${range.from ?? 0}`)
                            if (range.to) {
                                this.out.line(`to: ${range.to}`)
                            }
                        })
                        this.out.line(`},`)
                    }
                })
                this.out.line(`})`)
            }
            if (Object.keys(contract.functions).length > 0) {
                this.out.line(`processor.addTransaction(${contract.name}.address, {`)
                this.out.indentation(() => {
                    this.out.line(`sighash: [`)
                    this.out.indentation(() => {
                        for (let f in contract.functions) {
                            this.out.line(`${contract.name}.spec.functions['${f}'].sighash,`)
                        }
                    })
                    this.out.line(`],`)
                    this.out.line(`data: {`)
                    this.out.indentation(() => {
                        this.out.line(`transaction: {`)
                        this.out.indentation(() => {
                            this.out.line(`hash: true,`)
                            this.out.line(`input: true,`)
                            this.out.line(`from: true,`)
                            this.out.line(`value: true,`)
                        })
                        this.out.line(`},`)
                    })
                    this.out.line(`} as const,`)
                    if (contract.range != null && (contract.range.from != null || contract.range.to != null)) {
                        let range = contract.range
                        this.out.line(`range: {`)
                        this.out.indentation(() => {
                            this.out.line(`from: ${range.from ?? 0},`)
                            if (range.to != null) {
                                this.out.line(`to: ${range.to},`)
                            }
                        })
                        this.out.line(`},`)
                    }
                })
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
