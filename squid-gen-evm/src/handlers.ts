import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract} from './interfaces'
import {toCamelCase} from "@subsquid/util-naming";

export class HandlersCodegen {
    private eventsOut: FileOutput
    private functionsOut: FileOutput

    private json = false

    constructor(private outDir: OutDir, private options: {contract: SquidContract; dataTarget: DataTarget}) {
        this.eventsOut = this.outDir.file(`${options.contract.name}_events.ts`)
        this.functionsOut = this.outDir.file(`${options.contract.name}_functions.ts`)
    }

    generate() {
        this.printImports(this.eventsOut)
        this.printImports(this.functionsOut)
        this.printEventsHandlers()
        this.printFunctionHandlers()
        this.functionsOut.write()
        this.eventsOut.write()
    }

    private printImports(out: FileOutput) {
        const handlerType = out.file.endsWith('functions.ts') ? 'functions' : 'events'
        out.lazy(() => {
            out.line(`import type {DataHandlerContext} from '@subsquid/evm-processor'`)
            if (this.json) {
                out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
            }
            out.line(`import type {Store} from '${resolveModule(out.file, path.resolve(`src`, `db`))}'`)
            out.line(
                `import {${handlerType}} from '${resolveModule(
                    out.file,
                    path.resolve(`src`, `abi`, this.options.contract.spec)
                )}'`
            )
            if (handlerType === 'functions') {
                this.getFunctionTargetPrinter().printImports()
                out.line(`import {Transaction} from '${resolveModule(
                        out.file,
                        path.resolve(`src`, `processor`)
                    )}'`)
            } else {
                this.getEventTargetPrinter().printImports()
                out.line(`import {Log} from '${resolveModule(
                        out.file,
                        path.resolve(`src`, `processor`)
                    )}'`)
            }
        })
    }

    private printEventsHandlers() {
        this.eventsOut.line()
        const targetPrinter = this.getEventTargetPrinter()
        for (const e in this.options.contract.events) {
            const fragment = this.options.contract.events[e]
            const handlerName = toCamelCase(`handle_${e}_event`)
            this.eventsOut.block(`export function ${handlerName}(ctx: DataHandlerContext<Store>, log: Log)`, () => {
                this.eventsOut.line(`const e = events['${e}'].decode(log)`)
                targetPrinter.printFragmentSave(fragment, [
                    `log.id`,
                    `log.block.height`,
                    `new Date(log.block.timestamp)`,
                    `log.transaction!.hash`,
                    `log.address`,
                    `'${e}'`,
                    ...fragment.params.slice(6).map((p) => {
                        if (p.type === `json`) {
                            this.useJSON()
                            return `toJSON(e.${p.originalName ?? p.name})`
                        } else {
                            return `e.${p.originalName ?? p.name}`
                        }
                    }),
                ])
            })
        }
    }

    private printFunctionHandlers() {
        this.functionsOut.line()
        let targetPrinter = this.getFunctionTargetPrinter()
        for (const f in this.options.contract.functions) {
            const fragment = this.options.contract.functions[f]
            const handlerName = toCamelCase(`handle_${f}_function`)
            this.functionsOut.block(`export function ${handlerName}(ctx: DataHandlerContext<Store>, transaction: Transaction)`, () => {
                this.functionsOut.line(`const f = functions['${f}'].decode(transaction)`)
                targetPrinter.printFragmentSave(fragment, [
                    `transaction.id`,
                    `transaction.block.height`,
                    `new Date(transaction.block.timestamp)`,
                    `transaction!.hash`,
                    `transaction.to!`,
                    `'${f}'`,
                    `transaction.value`,
                    `transaction.status != null ? Boolean(transaction.status) : undefined`,
                    ...fragment.params.slice(8).map((p, i) => {
                        if (p.type === `json`) {
                            this.useJSON()
                            return `toJSON(f.${p.originalName ?? p.name})`
                        } else {
                            return `f.${p.originalName ?? p.name}`
                        }
                    }),
                ])
            })
        }
    }

    private useJSON() {
        this.json = true
    }

    @def
    private getEventTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.eventsOut)
    }

    @def
    private getFunctionTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.functionsOut)
    }
}
