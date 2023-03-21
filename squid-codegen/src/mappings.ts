import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract} from './interfaces'

export class MappingCodegen {
    private out: FileOutput

    private util = new Set<string>()
    private json = false

    private events = false
    private functions = false

    constructor(private outDir: OutDir, private options: {contract: SquidContract; dataTarget: DataTarget}) {
        this.out = this.outDir.file(`${options.contract.name}.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`export {spec}`)
        this.out.line()
        this.out.line(`export const address = '${this.options.contract.address.toLowerCase()}'`)
        this.out.line()
        this.out.line('type EventItem = LogItem<{evmLog: {topics: true, data: true}, transaction: {hash: true}}>')
        this.out.line('type FunctionItem = TransactionItem<{transaction: {hash: true, input: true, value: true}}>')
        this.out.line()
        this.out.block(
            `export function parse(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem | FunctionItem)`,
            () => {
                this.out.block(`switch (item.kind)`, () => {
                    if (Object.keys(this.options.contract.events).length > 0) {
                        this.useEventParser()
                        this.out.line(`case 'evmLog':`)
                        this.out.indentation(() => {
                            this.out.line(`return parseEvent(ctx, block, item)`)
                        })
                    }
                    if (Object.keys(this.options.contract.functions).length > 0) {
                        this.useFunctionParser()
                        this.out.line(`case 'transaction':`)
                        this.out.indentation(() => {
                            this.out.line(`return parseFunction(ctx, block, item)`)
                        })
                    }
                })
            }
        )
        this.printParsers()

        return this.out.write()
    }

    private printParsers() {
        if (this.events) {
            this.out.line()
            this.printEventsParser()
        }

        if (this.functions) {
            this.out.line()
            this.printFunctionsParser()
        }
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
            this.out.line(`import {Store} from '${resolveModule(this.out.file, path.resolve(`src`, `db`))}'`)
            this.getTargetPrinter().printImports()
            this.out.line(
                `import * as spec from '${resolveModule(
                    this.out.file,
                    path.resolve(`src`, `abi`, this.options.contract.spec)
                )}'`
            )
            if (this.util.size > 0) {
                this.out.line(
                    `import {${[...this.util].join(`, `)}} from '${resolveModule(
                        this.out.file,
                        path.resolve(`src`, `util`)
                    )}'`
                )
            }
        })
    }

    private printEventsParser() {
        let targetPrinter = this.getTargetPrinter()
        this.out.block(
            `function parseEvent(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem)`,
            () => {
                this.out.block(`try`, () => {
                    this.out.block(`switch (item.evmLog.topics[0])`, () => {
                        for (let e in this.options.contract.events) {
                            let fragment = this.options.contract.events[e]
                            this.out.block(`case spec.events['${e}'].topic:`, () => {
                                this.useUtil(`normalize`)
                                this.out.line(`let e = normalize(spec.events['${e}'].decode(item.evmLog))`)
                                targetPrinter.printFragmentSave(fragment, [
                                    `item.evmLog.id`,
                                    `block.height`,
                                    `new Date(block.timestamp)`,
                                    `item.transaction.hash`,
                                    `item.address`,
                                    `'${e}'`,
                                    ...fragment.params.map((p, i) => {
                                        if (p.type === `json`) {
                                            this.useJSON()
                                            return `toJSON(e[${i}])`
                                        } else {
                                            return `e[${i}]`
                                        }
                                    }),
                                ])
                            })
                        }
                    })
                })
                this.out.block(`catch (error)`, () => {
                    this.out.line(
                        `ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, ` +
                            `\`Unable to decode event "\${item.evmLog.topics[0]}"\`)`
                    )
                })
            }
        )
    }

    private printFunctionsParser() {
        let targetPrinter = this.getTargetPrinter()
        this.out.block(
            `function parseFunction(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: FunctionItem)`,
            () => {
                this.out.block(`try`, () => {
                    this.out.block(`switch (item.transaction.input.slice(0, 10))`, () => {
                        for (let f in this.options.contract.functions) {
                            let fragment = this.options.contract.functions[f]
                            this.out.block(`case spec.functions['${f}'].sighash:`, () => {
                                this.useUtil(`normalize`)
                                this.out.line(
                                    `let f = normalize(spec.functions['${f}'].decode(item.transaction.input))`
                                )
                                targetPrinter.printFragmentSave(fragment, [
                                    `item.transaction.id`,
                                    `block.height`,
                                    `new Date(block.timestamp)`,
                                    `item.transaction.hash`,
                                    `item.address`,
                                    `'${f}'`,
                                    `item.transaction.value`,
                                    ...fragment.params.map((p, i) => {
                                        if (p.type === `json`) {
                                            this.useJSON()
                                            return `toJSON(f[${i}])`
                                        } else {
                                            return `f[${i}]`
                                        }
                                    }),
                                ])
                            })
                        }
                    })
                })
                this.out.block(`catch (error)`, () => {
                    this.out.line(
                        `ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, ` +
                            `\`Unable to decode function "\${item.transaction.input.slice(0, 10)}"\`)`
                    )
                })
            }
        )
    }

    private useFunctionParser() {
        this.functions = true
    }

    private useEventParser() {
        this.events = true
    }

    private useUtil(str: string) {
        this.util.add(str)
    }

    private useJSON() {
        this.json = true
    }

    @def
    private getTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.out)
    }
}
