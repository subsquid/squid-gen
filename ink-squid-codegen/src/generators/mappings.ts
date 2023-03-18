import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract} from '../util/interfaces'
import {MODEL, resolveModule} from './paths'

export class MappingCodegen {
    private out: FileOutput

    private models = new Set<string>()
    private json = false

    constructor(private outDir: OutDir, private contract: SquidContract) {
        this.out = this.outDir.file(`${contract.name}.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`export const address = '${this.contract.address}'`)
        this.out.line()
        this.out.block(
            `export function parse(block: SubstrateBlock, event: ContractsContractEmittedEvent)`,
            () => {
                this.out.line(`let e = ${this.contract.name}.decodeEvent(event.args.data)`)
                this.out.line(`switch (e.__kind) {`)
                this.out.indentation(() => {
                    for (let e of this.contract.events) {
                        this.out.block(`case '${e.name}':`, () => {
                            this.useModel(e.entity.name)
                            this.out.line(`return new ${e.entity.name}({`)
                            this.out.indentation(() => {
                                this.out.line(`id: event.id,`)
                                this.out.line(`blockNumber: block.height,`)
                                this.out.line(`blockTimestamp: new Date(block.timestamp),`)
                                this.out.line(`contract: event.args.contract,`)
                                this.out.line(`eventName: '${e.name}',`)
                                for (let i = 0; i < e.entity.fields.length; i++) {
                                    if (e.entity.fields[i].schemaType === 'JSON') {
                                        this.useJSON()
                                        this.out.line(`${e.entity.fields[i].name}: toJSON(e.${e.entity.fields[i].name}),`)
                                    } else {
                                        this.out.line(`${e.entity.fields[i].name}: e.${e.entity.fields[i].name},`)
                                    }
                                }
                            })
                            this.out.line(`})`)
                        })
                    }
                })
                this.out.line(`}`)
            })
        this.out.line()

        return this.out.write()
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(`import {SubstrateBlock, ContractsContractEmittedEvent} from '@subsquid/substrate-processor'`)
            this.out.line(`import * as ${this.contract.name} from '../abi/${this.contract.name}'`)
            if (this.json) {
                this.out.line(`import {toJSON} from '@subsquid/util-internal-json'`)
            }
            if (this.models.size > 0) {
                this.out.line(
                    `import {${[...this.models].join(`, `)}} from '${resolveModule(this.outDir.path(), MODEL)}'`
                )
            }
        })
    }

    private useModel(str: string) {
        this.models.add(str)
    }

    private useJSON() {
        this.json = true
    }
}
