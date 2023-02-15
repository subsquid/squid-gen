import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract, SquidFragment} from '../util/interfaces'

export class SchemaCodegen {
    private out: FileOutput

    constructor(outDir: OutDir, private contracts: SquidContract[]) {
        this.out = outDir.file(`schema.graphql`)
    }

    generate() {
        this.out.block(`type Block @entity`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`number: Int! @index`)
            this.out.line(`timestamp: DateTime!`)
            this.out.line(`transactions: [Transaction!]! @derivedFrom(field: "block")`)
        })
        this.out.line()
        this.out.block(`type Transaction @entity`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`hash: String! @index`)
            this.out.line(`block: Block!`)
            this.out.line(`contract: String`)
        })
        this.out.line()
        this.out.block(`interface Event @query`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`block: Block!`)
            this.out.line(`transaction: Transaction!`)
            this.out.line(`name: String!`)
        })
        for (let contract of this.contracts) {
            for (let e of contract.events) {
                this.out.line()
                this.out.block(`type ${e.entity.name} implements Event @entity`, () => {
                    this.out.line(`id: ID!`)
                    this.out.line(`block: Block!`)
                    this.out.line(`transaction: Transaction!`)
                    this.out.line(`name: String! @index`)
                    for (let param of e.entity.fields) {
                        let field = `${param.name}: ${param.schemaType}${param.required ? `!` : ``}`
                        if (param.indexed) {
                            field += ` @index`
                        }
                        this.out.line(field)
                    }
                })
            }
            this.out.line()
            this.out.block(`interface Function @query`, () => {
                this.out.line(`id: ID!`)
                this.out.line(`block: Block!`)
                this.out.line(`transaction: Transaction!`)
                this.out.line(`name: String!`)
            })
            for (let f of contract.functions) {
                this.out.line()
                this.out.block(`type ${f.entity.name} implements Function @entity`, () => {
                    this.out.line(`id: ID!`)
                    this.out.line(`block: Block!`)
                    this.out.line(`transaction: Transaction!`)
                    this.out.line(`name: String! @index`)
                    for (let param of f.entity.fields) {
                        let field = `${param.name}: ${param.schemaType}`
                        if (param.indexed) {
                            field += ` @index`
                        }
                        this.out.line(field)
                    }
                })
            }
        }
        this.out.write()
    }
}
