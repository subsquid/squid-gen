import {FileOutput, OutDir, Output} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidFragment} from './interfaces'

export class ProcessorCodegen {
    private out: FileOutput

    private models = new Set<string>()
    private events = new Set<string>()
    private functions = new Set<string>()
    private util = new Set<string>()
    private json = false
    private archiveRegistry = false

    constructor(
        private outDir: OutDir,
        private options: {
            address: string
            archive: SquidArchive
            typegenFileName: string
            events: SquidFragment[]
            functions: SquidFragment[]
            from?: number
        }
    ) {
        this.out = this.outDir.file(`processor.ts`)
    }

    generate() {
        this.generateProcessor()
        this.outDir.add(`util.ts`, [__dirname, '../support/util.ts'])
    }

    private generateProcessor() {
        this.printImports()
        this.out.line()
        this.out.line(`const CONTRACT_ADDRESS = '${this.options.address}'`)
        this.out.line()
        this.out.line(`const processor = new EvmBatchProcessor()`)
        this.out.indentation(() => {
            this.out.line(`.setDataSource({`)
            this.out.indentation(() => {
                if (this.options.archive.kind === 'name') {
                    this.useArchiveRegistry()
                    this.out.line(`archive: lookupArchive('${this.options.archive.value}', {type: 'EVM'}),`)
                } else {
                    this.out.line(`archive: '${this.options.archive}',`)
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

            if (this.hasEvents()) {
                this.printEvmLogSubscribe(this.options.events)
            }
            if (this.hasFunctions()) {
                this.printTransactionSubscribe(this.options.functions)
            }
        })
        this.out.line()
        this.printEntityUnionType(this.out)
        this.out.line()
        this.out.line(`processor.run(new TypeormDatabase(), async (ctx) => {`)
        this.out.indentation(() => {
            if (this.hasEvents()) {
                this.out.line(`let events: Record<string, SquidEventEntity[]> = {}`)
            }
            if (this.hasFunctions()) {
                this.out.line(`let functions: Record<string, SquidFunctionEntity[]> = {}`)
            }

            this.useModel(`Transaction`)
            this.out.line(`let transactions: Transaction[] = []`)
            this.useModel(`Block`)
            this.out.line(`let blocks: Block[] = []`)

            this.out.block(`for (let {header: block, items} of ctx.blocks)`, () => {
                this.out.line(`let b = new Block({`)
                this.out.indentation(() => {
                    this.out.line(`id: block.id,`)
                    this.out.line(`number: block.height,`)
                    this.out.line(`timestamp: new Date(block.timestamp),`)
                })
                this.out.line(`})`)
                this.out.line(`let blockTransactions = new Map<string, Transaction>()`)
                this.out.block(`for (let item of items)`, () => {
                    this.out.line(`if (item.address !== CONTRACT_ADDRESS) continue`)
                    if (this.hasEvents() || this.hasFunctions()) {
                        this.out.line(`let it: SquidEntity | undefined`)
                        this.out.block(`switch (item.kind)`, () => {
                            if (this.hasEvents()) {
                                this.out.line(`case 'evmLog':`)
                                this.out.indentation(() => {
                                    this.out.line(`let e = it = parseEvmLog(ctx, item)`)
                                    this.out.block(`if (e)`, () => {
                                        this.out.line(`if (events[e.name] == null) events[e.name] = []`)
                                        this.out.line(`events[e.name].push(e)`)
                                    })
                                    this.out.line(`break`)
                                })
                            }
                            if (this.hasFunctions()) {
                                this.out.line(`case 'transaction':`)
                                this.out.indentation(() => {
                                    this.out.line(`let f = it = parseTransaction(ctx, item)`)
                                    this.out.block(`if (f)`, () => {
                                        this.out.line(`if (functions[f.name] == null) functions[f.name] = []`)
                                        this.out.line(`functions[f.name].push(f)`)
                                    })
                                    this.out.line(`break`)
                                })
                            }
                            this.out.line(`default:`)
                            this.out.indentation(() => this.out.line(`continue`))
                        })
                        this.out.block(`if (it)`, () => {
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
                            this.out.line(`it.transaction = t`)
                            this.out.line(`it.block = b`)
                        })
                    }
                })
                this.out.block(`if (blockTransactions.size > 0)`, () => {
                    this.out.line(`blocks.push(b)`)
                    this.out.line(`transactions.push(...blockTransactions.values())`)
                })
            })
            this.out.line(`await ctx.store.save(blocks)`)
            this.out.line(`await ctx.store.save(transactions)`)
            if (this.hasFunctions()) {
                this.out.block(`for (let f in functions)`, () => {
                    this.out.line(`await ctx.store.save(functions[f])`)
                })
            }
            if (this.hasEvents()) {
                this.out.block(`for (let e in events)`, () => {
                    this.out.line(`await ctx.store.save(events[e])`)
                })
            }
        })
        this.out.line(`})`)
        this.out.line()
        this.out.line(`type Item = BatchProcessorItem<typeof processor>`)
        this.out.line(`type Context = BatchHandlerContext<Store, Item>`)
        if (this.hasEvents()) {
            this.out.line()
            this.printEventsParser(this.options.events)
        }
        if (this.hasFunctions()) {
            this.out.line()
            this.printFunctionsParser(this.options.functions)
        }

        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import * as abi from './abi/${this.options.typegenFileName}'`)
            this.out.line(
                `import {EvmBatchProcessor, BatchProcessorItem, BatchProcessorLogItem, BatchHandlerContext, BatchProcessorTransactionItem} ` +
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
        })
    }

    private printEvmLogSubscribe(events: SquidFragment[]) {
        this.out.line(`.addLog(CONTRACT_ADDRESS, {`)
        this.out.indentation(() => {
            this.out.line(`filter: [`)
            this.out.indentation(() => {
                this.out.line(`[`)
                this.out.indentation(() => {
                    for (let e of events) {
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

    private printTransactionSubscribe(functions: SquidFragment[]) {
        this.out.line(`.addTransaction(CONTRACT_ADDRESS, {`)
        this.out.indentation(() => {
            this.out.line(`sighash: [`)
            this.out.indentation(() => {
                for (let t of functions) {
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

    private printEventsParser(events: SquidFragment[]) {
        this.out.line(
            `function parseEvmLog(ctx: Context, item: BatchProcessorLogItem<typeof processor>): SquidEventEntity | undefined {`
        )
        this.out.indentation(() => {
            this.out.line(`switch (item.evmLog.topics[0]) {`)
            this.out.indentation(() => {
                for (let e of events) {
                    this.out.block(`case abi.events['${e.name}'].topic:`, () => {
                        this.useUtil(`normalize`)
                        this.out.line(`let e = normalize(abi.events['${e.name}'].decode(item.evmLog))`)
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
        this.out.line(`}`)
    }

    private printFunctionsParser(functions: SquidFragment[]) {
        this.out.line(
            `function parseTransaction(ctx: Context, item: BatchProcessorTransactionItem<typeof processor>): SquidFunctionEntity | undefined  {`
        )
        this.out.indentation(() => {
            this.out.line(`switch (item.transaction.input.slice(0, 10)) {`)
            this.out.indentation(() => {
                for (let f of functions) {
                    this.out.block(`case abi.functions['${f.name}'].sighash:`, () => {
                        this.useUtil(`normalize`)
                        this.out.line(`let f = normalize(abi.functions['${f.name}'].decode(item.transaction.input))`)
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

    private hasEvents() {
        return this.options.events.length > 0
    }

    private hasFunctions() {
        return this.options.functions.length > 0
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
        this.util.add(str)
    }

    private useJSON() {
        this.json = true
    }
}
