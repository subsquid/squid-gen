import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract} from './interfaces'
import {toCamelCase} from "@subsquid/util-naming";

export class MappingCodegen {
    private out: FileOutput

    private util = new Set<string>()
    private processor = new Set<string>()
    private json = false

    constructor(private outDir: OutDir, private options: {contract: SquidContract; dataTarget: DataTarget}) {
        this.out = this.outDir.file(`${options.contract.name}.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`const address = '${this.options.contract.address.toLowerCase()}'`)
        this.out.line()
        this.out.line()
        this.printEventsParser()
        this.out.line()
        this.printFunctionsParser()
        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {DataHandlerContext} from '@subsquid/evm-processor'`)
            if (this.json) {
                this.out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
            }
            this.out.line(`import {Store} from '${resolveModule(this.out.file, path.resolve(`src`, `db`))}'`)
            this.getTargetPrinter().printImports()
            this.out.line(
                `import {functions, events} from '${resolveModule(
                    this.out.file,
                    path.resolve(`src`, `abi`, this.options.contract.spec)
                )}'`
            )
            this.out.line(
                `import * as eventHandlers from '${resolveModule(
                    this.out.file,
                    path.resolve(`src`, `handlers`, `${this.options.contract.name}_events`)
                )}'`
            )
            this.out.line(
                `import * as functionHandlers from '${resolveModule(
                    this.out.file,
                    path.resolve(`src`, `handlers`, `${this.options.contract.name}_functions`)
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
            if (this.processor.size > 0) {
                this.out.line(
                    `import {${[...this.processor].join(`, `)}} from '${resolveModule(
                        this.out.file,
                        path.resolve(`src`, `processor`)
                    )}'`
                )
            }
        })
    }

    private propGetter(prop: string) {
        if (prop.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            return `.${prop}`
        }
        return `['${prop}']`
    }

    private printEventHandle(fragmentName: string, abiName: string) {
        this.out.block(`if (events${this.propGetter(abiName)}.is(log))`, () => {
            this.out.line(`return eventHandlers.${toCamelCase(`handle_${fragmentName}_event`)}(ctx, log)`)
        })
    }

    private printEventsParser() {
        this.useProcessor('Log')
        this.out.block(`export function parseEvent(ctx: DataHandlerContext<Store>, log: Log)`, () => {
            this.out.block(`try`, () => {
                for (const e in this.options.contract.events) {
                    this.printEventHandle(e, this.options.contract.events[e].abiName)
                }
            })
            this.out.block(`catch (error)`, () => {
                this.out.line(
                    `ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, ` +
                        `\`Unable to decode event "\${log.topics[0]}"\`)`
                )
            })
        })
    }

    private printFunctionHandle(fragmentName: string, abiName: string) {
        this.out.block(`if (functions${this.propGetter(abiName)}.is(transaction))`, () => {
            this.out.line(`return functionHandlers.${toCamelCase(`handle_${fragmentName}_function`)}(ctx, transaction)`)
        })
    }

    private printFunctionsParser() {
        this.useProcessor('Transaction')
        this.out.block(
            `export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction)`,
            () => {
                this.out.block(`try`, () => {
                    for (const f in this.options.contract.functions) {
                        this.printFunctionHandle(f, this.options.contract.functions[f].abiName)
                    }
                })
                this.out.block(`catch (error)`, () => {
                    this.out.line(
                        `ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, ` +
                            `\`Unable to decode function "\${transaction.input.slice(0, 10)}"\`)`
                    )
                })
            }
        )
    }

    private useProcessor(str: string) {
        this.processor.add(str)
    }

    @def
    private getTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.out)
    }
}
