import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidContract} from '../util/interfaces'
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
        this.out.line(`processor.run(new TypeormDatabase(), async (ctx: BatchContext<Store, any>) => {`)
        this.out.indentation(() => {
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
                this.out.block(`for (let item of items)`, () => {
                    this.out.block(`let addEntity = (e: any) =>`, () => {
                        this.out.line(`let a = other[e.constructor.name]`)
                        this.out.block(`if (a == null)`, () => {
                            this.out.line(`a = []`)
                            this.out.line(`other[e.constructor.name] = a`)
                        })
                        this.out.line(`a.push(e)`)
                    })

                    this.out.line()
                    this.out.block(`if (item.kind == 'event' && item.event.name == 'Contracts.ContractEmitted')`, () => {
                        for (let contract of this.options.contracts) {
                            this.useMapping(contract.name)
                            this.out.block(`if (item.event.args.contract == ${contract.name}.address)`, () => {
                                this.out.line(`let e = ${contract.name}.parse(block, item.event)`)
                                this.out.line(`addEntity(e)`)
                            })
                        }
                    })
                })
            })
            this.out.line(`await ctx.store.save(blocks)`)
            this.out.block(`for (let e in other)`, () => {
                this.out.line(`await ctx.store.save(other[e])`)
            })
        })
        this.out.line(`})`)
        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {SubstrateBatchProcessor, BatchContext} from '@subsquid/substrate-processor'`)
            this.out.line(`import {Store, TypeormDatabase} from '@subsquid/typeorm-store'`)
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
                this.out.line(`.addContractsContractEmitted(${contract.name}.address, {`)
                this.out.indentation(() => {
                    this.out.line(`data: {`)
                    this.out.indentation(() => {
                        this.out.line(`event: {args: true}`)
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

    private useModel(str: string) {
        this.models.add(str)
    }

    private useMapping(str: string) {
        this.mappings.add(str)
    }
}
