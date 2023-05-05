import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract} from './interfaces'

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

    private printEventsParser() {
        let targetPrinter = this.getTargetPrinter()
        this.useProcessor('Log')
        this.out.block(`export function parseEvent(ctx: DataHandlerContext<Store>, log: Log)`, () => {
            this.out.block(`try`, () => {
                this.out.block(`switch (log.topics[0])`, () => {
                    for (let e in this.options.contract.events) {
                        let fragment = this.options.contract.events[e]
                        this.out.block(`case spec.events['${e}'].topic:`, () => {
                            this.out.line(`let e = spec.events['${e}'].decode(log)`)
                            targetPrinter.printFragmentSave(fragment, [
                                `log.id`,
                                `log.block.height`,
                                `new Date(log.block.timestamp)`,
                                `log.transactionHash`,
                                `log.address`,
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
                            this.out.line('break')
                        })
                    }
                })
            })
            this.out.block(`catch (error)`, () => {
                this.out.line(
                    `ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, ` +
                        `\`Unable to decode event "\${log.topics[0]}"\`)`
                )
            })
        })
    }

    private printFunctionsParser() {
        let targetPrinter = this.getTargetPrinter()
        this.useProcessor('Transaction')
        this.out.block(
            `export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction)`,
            () => {
                this.out.block(`try`, () => {
                    this.out.block(`switch (transaction.input.slice(0, 10))`, () => {
                        for (let f in this.options.contract.functions) {
                            let fragment = this.options.contract.functions[f]
                            this.out.block(`case spec.functions['${f}'].sighash:`, () => {
                                this.out.line(`let f = spec.functions['${f}'].decode(transaction.input)`)
                                targetPrinter.printFragmentSave(fragment, [
                                    `transaction.id`,
                                    `transaction.block.height`,
                                    `new Date(transaction.block.timestamp)`,
                                    `transaction.hash`,
                                    `transaction.to`,
                                    `'${f}'`,
                                    `transaction.value`,
                                    `transaction.status != null ? Boolean(transaction.status) : undefined`,
                                    ...fragment.params.map((p, i) => {
                                        if (p.type === `json`) {
                                            this.useJSON()
                                            return `toJSON(f[${i}])`
                                        } else {
                                            return `f[${i}]`
                                        }
                                    }),
                                ])
                                this.out.line('break')
                            })
                        }
                    })
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

    private useJSON() {
        this.json = true
    }

    private useProcessor(str: string) {
        this.processor.add(str)
    }

    @def
    private getTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.out)
    }
}
