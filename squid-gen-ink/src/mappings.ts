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

    constructor(private outDir: OutDir, private options: {contract: SquidContract; dataTarget: DataTarget}) {
        this.out = this.outDir.file(`${options.contract.name}.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`export const address = '${this.options.contract.address}'`)
        this.out.line()
        let targetPrinter = this.getTargetPrinter()
        this.out.block(`export function parse(block: SubstrateBlock, event: ContractsContractEmittedEvent)`, () => {
            this.useUtil(`normalize`)
            this.out.line(`let e = normalize(spec.decodeEvent(event.args.data))`)
            this.out.block(`switch (e.__kind)`, () => {
                for (let e in this.options.contract.events) {
                    let fragment = this.options.contract.events[e]
                    this.out.block(`case '${e}':`, () => {
                        targetPrinter.printFragmentSave(fragment, [
                            `event.id`,
                            `block.height`,
                            `new Date(block.timestamp)`,
                            `event.extrinsic.hash`,
                            `event.args.contract`,
                            `'${e}'`,
                            ...fragment.params
                                .filter((p) => !p.static)
                                .map((p) => {
                                    if (p.type === `json`) {
                                        this.useJSON()
                                        return `toJSON(e.${p.name})`
                                    } else {
                                        return `e.${p.name}`
                                    }
                                }),
                        ])
                        this.out.line('break')
                    })
                }
            })
        })
        this.out.line()

        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {SubstrateBlock, ContractsContractEmittedEvent} from '@subsquid/substrate-processor'`)
            this.getTargetPrinter().printImports()
            this.out.line(
                `import * as spec from '${resolveModule(
                    this.out.file,
                    path.resolve(`src`, `abi`, this.options.contract.name)
                )}'`
            )
            if (this.json) {
                this.out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
            }
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
