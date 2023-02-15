import {FileOutput, OutDir, Output} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidContract, SquidFragment} from '../util/interfaces'
import {MAPPING, MODEL, resolveModule} from './paths'

export class ProcessorCodegen {
    private out: FileOutput

    private models = new Set<string>()
    private mappings = new Set<string>()
    private archiveRegistry = false

    constructor(
        private outDir: OutDir,
        private options: {
            archive: SquidArchive
            contracts: SquidContract[]
            from?: number
        }
    ) {
        this.out = this.outDir.file(`processor.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`const processor = new EvmBatchProcessor()`)
        this.out.indentation(() => {
            this.out.line(`.setDataSource({`)
            this.out.indentation(() => {
                if (this.options.archive.kind === 'name') {
                    this.useArchiveRegistry()
                    this.out.line(`archive: lookupArchive('${this.options.archive.value}', {type: 'EVM'}),`)
                } else {
                    this.out.line(`archive: '${this.options.archive.value}',`)
                }
            })
            this.out.line(`})`)
            if (this.options.from != null) {
                this.out.line(`.setBlockRange({`)
                this.out.indentation(() => {
                    this.out.line(`from: ${this.options.from}`)
                })
                this.out.line(`})`)
            }
            this.printSubscribes()
        })
        this.out.line()
        this.out.line(`processor.run(new TypeormDatabase(), async (ctx) => {`)
        this.out.indentation(() => {
            this.useModel(`Transaction`)
            this.out.line(`let transactions: Transaction[] = []`)
            this.useModel(`Block`)
            this.out.line(`let blocks: Block[] = []`)
            this.out.line(`let other: Record<string, any[]> = {}`)
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
                            this.out.line(`hash: item.transaction.hash,`)
                            this.out.line(`contract: item.transaction.to,`)
                            this.out.line(`block: b,`)
                        })
                        this.out.line(`})`)
                        this.out.line(`blockTransactions.set(t.id, t)`)
                    })

                    this.out.line(``)
                    this.out.block(`let addEntity = (e: any) =>`, () => {
                        this.out.line(`let a = other[e.contructor.name]`)
                        this.out.block(`if (a == null)`, () => {
                            this.out.line(`a = []`)
                            this.out.line(`other[e.contructor.name] = a`)
                        })
                        this.out.line(`e.transaction = t`)
                        this.out.line(`e.block = b`)
                        this.out.line(`a.push(e)`)
                    })

                    for (let contract of this.options.contracts) {
                        this.out.line(``)
                        this.out.block(`if (item.address === ${contract.name}.address)`, () => {
                            this.useMapping(contract.name)
                            this.out.line(`let e = ${contract.name}.parse(ctx, block, item)`)
                            this.out.block(`if (e != null)`, () => {
                                this.out.line(`addEntity(e)`)
                            })
                        })
                    }
                })
                this.out.line(`transactions.push(...blockTransactions.values())`)
            })
            this.out.line(`await ctx.store.save(blocks)`)
            this.out.line(`await ctx.store.save(transactions)`)
            this.out.block(`for (let e in other)`, () => {
                this.out.line(`await ctx.store.save(other[e])`)
            })
        })
        this.out.line(`})`)
        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {EvmBatchProcessor} from '@subsquid/evm-processor'`)
            this.out.line(`import {TypeormDatabase} from '@subsquid/typeorm-store'`)
            if (this.archiveRegistry) {
                this.out.line(`import {lookupArchive} from '@subsquid/archive-registry'`)
            }
            if (this.models.size > 0) {
                this.out.line(
                    `import {${[...this.models].join(`, `)}} from '${resolveModule(this.outDir.path(), MODEL)}'`
                )
            }
            if (this.mappings.size > 0) {
                this.out.line(
                    `import {${[...this.mappings].join(`, `)}} from '${resolveModule(this.outDir.path(), MAPPING)}'`
                )
            }
        })
    }

    private printSubscribes() {
        for (let contract of this.options.contracts) {
            this.useMapping(contract.name)
            if (contract.events.length > 0) {
                this.out.line(`.addLog(${contract.name}.address, {`)
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
                        })
                        this.out.line(`},`)
                    })
                    this.out.line(`} as const,`)
                })
                this.out.line(`})`)
            }
            if (contract.functions.length > 0) {
                this.out.line(`.addTransaction(${contract.name}.address, {`)
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

    private useModel(str: string) {
        this.models.add(str)
    }

    private useMapping(str: string) {
        this.mappings.add(str)
    }
}
