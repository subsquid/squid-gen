import {DataTarget, DataTargetPrinter} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir, Output} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidContract} from '../util/interfaces'
import {MAPPING} from './paths'

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
        this.out.line(`processor.run(new TypeormDatabase(), async (ctx: BatchHandlerContext<Store, any>) => {`)
        this.out.indentation(() => {
            this.out.block(`for (let {header: block, items} of ctx.blocks)`, () => {
                this.out.line(`let b = new Block({`)
                this.out.indentation(() => {
                    this.out.line(`id: block.id,`)
                    this.out.line(`number: block.height,`)
                    this.out.line(`timestamp: new Date(block.timestamp),`)
                })
                this.out.line(`})`)
                this.out.line(`blocks.push(b)`)
                this.out.line(`let blockTransactions = new Map<string, Transaction>()`)
                this.out.block(`for (let item of items)`, () => {
                    this.out.line(`let t = blockTransactions.get(item.transaction.id)`)
                    this.out.block(`if (t == null)`, () => {
                        this.out.line(`t = new Transaction({`)
                        this.out.indentation(() => {
                            this.out.line(`id: item.transaction.id,`)
                            this.out.line(`blockNumber: block.height,`)
                            this.out.line(`blockTimestamp: new Date(block.timestamp),`)
                            this.out.line(`hash: item.transaction.hash,`)
                            this.out.line(`to: item.transaction.to,`)
                            this.out.line(`from: item.transaction.from,`)
                        })
                        this.out.line(`})`)
                        this.out.line(`blockTransactions.set(t.id, t)`)
                    })

                    for (let contract of this.options.contracts) {
                        this.out.line()
                        this.out.block(`if (item.address === ${contract.name}.address)`, () => {
                            this.useMapping(contract.name)
                            this.out.line(`let e = ${contract.name}.parse(ctx, block, item)`)
                            this.out.block(`if (e != null)`, () => {})
                        })
                    }
                })
                this.out.line(`transactions.push(...blockTransactions.values())`)
            })
        })
        this.out.line(`})`)
        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {EvmBatchProcessor, BatchHandlerContext} from '@subsquid/evm-processor'`)
            this.out.line(`import {Store, TypeormDatabase} from '@subsquid/typeorm-store'`)

            if (this.archiveRegistry) {
                this.out.line(`import {lookupArchive} from '@subsquid/archive-registry'`)
            }

            if (this.mappings.size > 0) {
                this.out.line(
                    `import {${[...this.mappings].join(`, `)}} from '${resolveModule(this.outDir.path(), MAPPING)}'`
                )
            }

            this.getTargetPrinter().printImports()
        })
    }

    private printSubscribes() {
        for (let contract of this.options.contracts) {
            this.useMapping(contract.name)
            if (contract.events.length > 0) {
                this.out.line(`processor.addLog(${contract.name}.address, {`)
                this.out.indentation(() => {
                    this.out.line(`filter: [`)
                    this.out.indentation(() => {
                        this.out.line(`[`)
                        this.out.indentation(() => {
                            for (let e of contract.events) {
                                this.out.line(`${contract.name}.abi.events['${e.name}'].topic,`)
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
                    if (contract.range) {
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
                })
                this.out.line(`})`)
            }
            if (contract.functions.length > 0) {
                this.out.line(`processor.addTransaction(${contract.name}.address, {`)
                this.out.indentation(() => {
                    this.out.line(`sighash: [`)
                    this.out.indentation(() => {
                        for (let t of contract.functions) {
                            this.out.line(`${contract.name}.abi.functions['${t.name}'].sighash,`)
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
