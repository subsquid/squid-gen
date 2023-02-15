import {FileOutput, OutDir, Output} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidContract, SquidFragment} from '../util/interfaces'

export class ProcessorCodegen {
    private out: FileOutput

    private models = new Set<string>()
    private events = new Set<string>()
    private functions = new Set<string>()
    private util = new Set<string>()
    private parsers = new Set<string>()
    private json = false
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
        this.printEntityUnionType(this.out)
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
                    this.out.block(`if (!t)`, () => {
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
                        this.out.line(`let a = others[e.contructor.name]`)
                        this.out.block(`if (!a)`, () => {
                            this.out.line(`a = []`)
                            this.out.line(`others[e.contructor.name] = a`)
                        })
                        this.out.line(`a.push(e)`)
                    })

                    for (let contract of this.options.contracts) {
                        this.out.line(``)
                        this.out.block(`if (item.address === '${contract.address}')`, () => {
                            this.useParser(contract.name)
                            this.out.line(`let it = ${contract.name}.parse(item)`)
                            this.out.line(`e.transaction = t`)
                            this.out.line(`e.block = b`)
                            this.out.line(`if (!e) addEntity(e)`)
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
            this.out.line(
                `import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem, EvmBlock} ` +
                    `from '@subsquid/evm-processor'`
            )
            this.out.line(`import {Store, TypeormDatabase} from '@subsquid/typeorm-store'`)
            if (this.archiveRegistry) {
                this.out.line(`import {lookupArchive} from '@subsquid/archive-registry'`)
            }
            if (this.json) {
                this.out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
            }
            if (this.models.size > 0) {
                this.out.line(`import {${[...this.models].join(`, `)}} from './model'`)
            }
            if (this.util.size > 0) {
                this.out.line(`import {${[...this.util].join(`, `)}} from './util'`)
            }
            if (this.parsers.size > 0) {
                this.out.line(`import {${[...this.parsers].join(`, `)}} from './parsers'`)
            }
        })
    }

    private printSubscribes() {
        this.out.lazy(() => {
            for (let contract of this.options.contracts) {
                if (contract.events.length > 0) {
                    this.out.line(`.addLog(${contract.address}, {`)
                    this.out.indentation(() => {
                        this.out.line(`filter: [`)
                        this.out.indentation(() => {
                            this.out.line(`[`)
                            this.out.indentation(() => {
                                for (let e of contract.events) {
                                    this.out.line(`abi.events['${e.name}'].topic,`)
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
                    this.out.line(`.addTransaction(${contract.functions}, {`)
                    this.out.indentation(() => {
                        this.out.line(`sighash: [`)
                        this.out.indentation(() => {
                            for (let t of contract.functions) {
                                this.out.line(`abi.functions['${t.name}'].sighash,`)
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
        })
    }

    private printEventsParser(events: SquidFragment[]) {
        this.out.line(
            `function parseEvmLog(ctx: Context, block: EvmBlock, item: BatchProcessorLogItem<typeof processor>): SquidEventEntity | undefined {`
        )
        this.out.indentation(() => {
            this.out.line(`try {`)
            this.out.indentation(() => {
                this.out.line(`switch (item.evmLog.topics[0]) {`)
                this.out.indentation(() => {
                    for (let e of events) {
                        this.out.block(`case abi.events['${e.name}'].topic:`, () => {
                            if (e.params.length > 0) {
                                this.useUtil(`normalize`)
                                this.out.line(`let e = normalize(abi.events['${e.name}'].decode(item.evmLog))`)
                            }
                            this.useEventModel(e.entityName)
                            this.out.line(`return new ${e.entityName}({`)
                            this.out.indentation(() => {
                                this.out.line(`id: item.evmLog.id,`)
                                this.out.line(`name: '${e.name}',`)
                                for (let i = 0; i < e.params.length; i++) {
                                    if (e.params[i].schemaType === 'JSON') {
                                        this.useJSON()
                                        this.out.line(`${e.params[i].name}: toJSON(e[${i}]),`)
                                    } else {
                                        this.out.line(`${e.params[i].name}: e[${i}],`)
                                    }
                                }
                            })
                            this.out.line(`})`)
                        })
                    }
                })
                this.out.line(`}`)
            })
            this.out.line(`} catch (error) {`)
            this.out.indentation(() => {
                this.out.line(
                    `ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, ` +
                        `\`Unable to decode event "\${item.evmLog.topics[0]}"\`)`
                )
            })
            this.out.line(`}`)
        })
        this.out.line(`}`)
    }

    private printFunctionsParser(functions: SquidFragment[]) {
        this.out.line(
            `function parseTransaction(ctx: Context, block: EvmBlock, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {`
        )
        this.out.indentation(() => {
            this.out.line(`try {`)
            this.out.indentation(() => {
                this.out.line(`switch (item.transaction.input.slice(0, 10)) {`)
                this.out.indentation(() => {
                    for (let f of functions) {
                        this.out.block(`case abi.functions['${f.name}'].sighash:`, () => {
                            if (f.params.length > 0) {
                                this.useUtil(`normalize`)
                                this.out.line(
                                    `let f = normalize(abi.functions['${f.name}'].decode(item.transaction.input))`
                                )
                            }
                            this.useFunctionsModel(f.entityName)
                            this.out.line(`return new ${f.entityName}({`)
                            this.out.indentation(() => {
                                this.out.line(`id: item.transaction.id,`)
                                this.out.line(`name: '${f.name}',`)
                                for (let i = 0; i < f.params.length; i++) {
                                    if (f.params[i].schemaType === 'JSON') {
                                        this.useJSON()
                                        this.out.line(`${f.params[i].name}: toJSON(f[${i}]),`)
                                    } else {
                                        this.out.line(`${f.params[i].name}: f[${i}],`)
                                    }
                                }
                            })
                            this.out.line(`})`)
                        })
                    }
                })
                this.out.line(`}`)
            })
            this.out.line(`} catch (error) {`)
            this.out.indentation(() => {
                this.out.line(
                    `ctx.log.error({error, blockNumber: block.height, blockHash: block.hash}, ` +
                        `\`Unable to decode function "\${item.transaction.input.slice(0, 10)}"\`)`
                )
            })
            this.out.line(`}`)
        })
        this.out.line(`}`)
    }

    private printEntityUnionType(out: Output) {
        this.out.lazy(() => {
            let models: string[] = []
            if (this.events.size > 0) {
                out.line(`type SquidEventEntity = ${[...this.events].join(` | `)}`)
                models.push(`SquidEventEntity`)
            }
            if (this.functions.size > 0) {
                out.line(`type SquidFunctionEntity = ${[...this.functions].join(` | `)}`)
                models.push(`SquidFunctionEntity`)
            }
            if (models.length > 0) {
                out.line(`type SquidEntity = ${models.join(` | `)}`)
            }
        })
    }

    private useArchiveRegistry() {
        this.archiveRegistry = true
    }

    private useModel(str: string) {
        this.models.add(str)
    }

    private useEventModel(str: string) {
        this.events.add(str)
        this.useModel(str)
    }

    private useFunctionsModel(str: string) {
        this.functions.add(str)
        this.useModel(str)
    }

    private useUtil(str: string) {
        if (this.util.size == 0) {
            this.outDir.add(`util.ts`, [__dirname, '../support/util.ts'])
        }
        this.util.add(str)
    }

    private useJSON() {
        this.json = true
    }

    private useParser(str: string) {
        this.parsers.add(str)
    }
}

// if (this.hasEvents() || this.hasFunctions()) {
//     this.out.block(`switch (item.kind)`, () => {
//         if (this.hasEvents()) {
//             this.out.line(`case 'evmLog':`)
//             this.out.indentation(() => {
//                 this.out.line(`let e = it = parseEvmLog(ctx, block, item)`)
//                 this.out.block(`if (e)`, () => {
//                     this.out.line(`if (events[e.name] == null) events[e.name] = []`)
//                     this.out.line(`events[e.name].push(e)`)
//                 })
//                 this.out.line(`break`)
//             })
//         }
//         if (this.hasFunctions()) {
//             this.out.line(`case 'transaction':`)
//             this.out.indentation(() => {
//                 this.out.line(`let f = it = parseTransaction(ctx, block, item)`)
//                 this.out.block(`if (f)`, () => {
//                     this.out.line(`if (functions[f.name] == null) functions[f.name] = []`)
//                     this.out.line(`functions[f.name].push(f)`)
//                 })
//                 this.out.line(`break`)
//             })
//         }
//         this.out.line(`default:`)
//         this.out.indentation(() => this.out.line(`continue`))
//     })
// }
