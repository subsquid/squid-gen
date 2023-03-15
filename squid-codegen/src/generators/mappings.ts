import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import path from 'path'
import {SquidContract} from '../util/interfaces'
import {ABI, MODEL, resolveModule, UTIL} from './paths'

export class MappingCodegen {
    private out: FileOutput

    private models = new Set<string>()
    private util = new Set<string>()
    private json = false

    constructor(private outDir: OutDir, private contract: SquidContract) {
        this.out = this.outDir.file(`${contract.name}.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`export {abi}`)
        this.out.line()
        this.out.line(`export const address = '${this.contract.address.toLowerCase()}'`)
        this.out.line()
        this.out.line('type EventItem = LogItem<{evmLog: {topics: true, data: true}, transaction: {hash: true}}>')
        this.out.line('type FunctionItem = TransactionItem<{transaction: {hash: true, input: true, value: true}}>')
        this.out.line()
        this.out.block(
            `export function parse(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: EventItem | FunctionItem)`,
            () => {
                this.out.block(`switch (item.kind)`, () => {
                    if (this.contract.events.length > 0) {
                        this.out.line(`case 'evmLog':`)
                        this.out.indentation(() => {
                            this.out.line(`return parseEvent(ctx, block, item)`)
                        })
                    }
                    if (this.contract.functions.length > 0) {
                        this.out.line(`case 'transaction':`)
                        this.out.indentation(() => {
                            this.out.line(`return parseFunction(ctx, block, item)`)
                        })
                    }
                })
            }
        )
        this.out.line()
        if (this.contract.events.length > 0) {
            this.printEventsParser()
        }
        this.out.line()
        if (this.contract.functions.length > 0) {
            this.printFunctionsParser()
        }

        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {CommonHandlerContext, EvmBlock} from '@subsquid/evm-processor'`)
            this.out.line(
                `import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'`
            )
            if (this.json) {
                this.out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
            }
            this.out.line(
                `import * as abi from '${resolveModule(this.outDir.path(), path.join(ABI, this.contract.spec))}'`
            )
            if (this.models.size > 0) {
                this.out.line(
                    `import {${[...this.models].join(`, `)}} from '${resolveModule(this.outDir.path(), MODEL)}'`
                )
            }
            if (this.util.size > 0) {
                this.out.line(`import {${[...this.util].join(`, `)}} from '${resolveModule(this.outDir.path(), UTIL)}'`)
            }
        })
    }

    private printEventsParser() {
        this.out.line(`function parseEvent(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: EventItem) {`)
        this.out.indentation(() => {
            this.out.line(`try {`)
            this.out.indentation(() => {
                this.out.line(`switch (item.evmLog.topics[0]) {`)
                this.out.indentation(() => {
                    for (let e of this.contract.events) {
                        this.out.block(`case abi.events['${e.name}'].topic:`, () => {
                            if (e.entity.fields.length > 0) {
                                this.useUtil(`normalize`)
                                this.out.line(`let e = normalize(abi.events['${e.name}'].decode(item.evmLog))`)
                            }
                            this.useModel(e.entity.name)
                            this.out.line(`return new ${e.entity.name}({`)
                            this.out.indentation(() => {
                                this.out.line(`id: item.evmLog.id,`)
                                this.out.line(`blockNumber: block.height,`)
                                this.out.line(`transactionHash: item.transaction.hash,`)
                                this.out.line(`blockTimestamp: new Date(block.timestamp),`)
                                this.out.line(`contract: item.address,`)
                                this.out.line(`eventName: '${e.name}',`)
                                for (let i = 0; i < e.entity.fields.length; i++) {
                                    if (e.entity.fields[i].schemaType === 'JSON') {
                                        this.useJSON()
                                        this.out.line(`${e.entity.fields[i].name}: toJSON(e[${i}]),`)
                                    } else {
                                        this.out.line(`${e.entity.fields[i].name}: e[${i}],`)
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
                    `ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, ` +
                        `\`Unable to decode event "\${item.evmLog.topics[0]}"\`)`
                )
            })
            this.out.line(`}`)
        })
        this.out.line(`}`)
    }

    private printFunctionsParser() {
        this.out.line(
            `function parseFunction(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: FunctionItem) {`
        )
        this.out.indentation(() => {
            this.out.line(`try {`)
            this.out.indentation(() => {
                this.out.line(`switch (item.transaction.input.slice(0, 10)) {`)
                this.out.indentation(() => {
                    for (let f of this.contract.functions) {
                        this.out.block(`case abi.functions['${f.name}'].sighash:`, () => {
                            if (f.entity.fields.length > 0) {
                                this.useUtil(`normalize`)
                                this.out.line(
                                    `let f = normalize(abi.functions['${f.name}'].decode(item.transaction.input))`
                                )
                            }
                            this.useModel(f.entity.name)
                            this.out.line(`return new ${f.entity.name}({`)
                            this.out.indentation(() => {
                                this.out.line(`id: item.transaction.id,`)
                                this.out.line(`blockNumber: block.height,`)
                                this.out.line(`transactionHash: item.transaction.hash,`)
                                this.out.line(`blockTimestamp: new Date(block.timestamp),`)
                                this.out.line(`contract: item.address,`)
                                this.out.line(`functionName: '${f.name}',`)
                                this.out.line(`functionValue: item.transaction.value,`)
                                for (let i = 0; i < f.entity.fields.length; i++) {
                                    if (f.entity.fields[i].schemaType === 'JSON') {
                                        this.useJSON()
                                        this.out.line(`${f.entity.fields[i].name}: toJSON(f[${i}]),`)
                                    } else {
                                        this.out.line(`${f.entity.fields[i].name}: f[${i}],`)
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
                    `ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, ` +
                        `\`Unable to decode function "\${item.transaction.input.slice(0, 10)}"\`)`
                )
            })
            this.out.line(`}`)
        })
        this.out.line(`}`)
    }

    private useModel(str: string) {
        this.models.add(str)
    }

    private useUtil(str: string) {
        this.util.add(str)
    }

    private useJSON() {
        this.json = true
    }
}
