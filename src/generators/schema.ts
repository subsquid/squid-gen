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
            this.out.line(`timestamp: DateTime! @index`)
        })
        this.out.line()
        this.out.block(`type Transaction @entity`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`hash: String! @index`)
            this.out.line(`blockNumber: Int! @index`)
            this.out.line(`timestamp: DateTime! @index`)
            this.out.line(`contract: String!`)
        })
        this.out.line()
        this.out.block(`interface Event @query`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`blockNumber: Int!`)
            this.out.line(`timestamp: DateTime!`)
            this.out.line(`contract: String!`)
            this.out.line(`name: String!`)
        })
        this.out.line()
        this.out.block(`interface Function @query`, () => {
            this.out.line(`id: ID!`)
            this.out.line(`blockNumber: Int!`)
            this.out.line(`transactionHash: String!`)
            this.out.line(`timestamp: DateTime!`)
            this.out.line(`contract: String!`)
            this.out.line(`name: String!`)
        })
        for (let contract of this.contracts) {
            for (let e of contract.events) {
                this.out.line()
                let indexedFields = e.entity.fields.filter((f) => f.indexed).map((f) => `"${f.name}"`)
                this.out.block(
                    `type ${e.entity.name} implements Event @entity` +
                        (indexedFields.length > 0 ? ` @index(fields: [${indexedFields.join(', ')}])` : ``),
                    () => {
                        this.out.line(`id: ID!`)
                        this.out.line(`blockNumber: Int! @index`)
                        this.out.line(`transactionHash: String! @index`)
                        this.out.line(`timestamp: DateTime! @index`)
                        this.out.line(`contract: String!`)
                        this.out.line(`name: String! @index`)
                        for (let param of e.entity.fields) {
                            let field = `${param.name}: ${param.schemaType}${param.required ? `!` : ``}`
                            this.out.line(field)
                        }
                    }
                )
            }
            for (let f of contract.functions) {
                this.out.line()
                let indexedFields = f.entity.fields.filter((f) => f.indexed).map((f) => `"${f.name}"`)
                this.out.block(
                    `type ${f.entity.name} implements Function @entity` +
                        (indexedFields.length > 0 ? ` @index(fields: [${indexedFields.join(', ')}])` : ``),
                    () => {
                        this.out.line(`id: ID!`)
                        this.out.line(`blockNumber: Int! @index`)
                        this.out.line(`transactionHash: String! @index`)
                        this.out.line(`timestamp: DateTime! @index`)
                        this.out.line(`contract: String!`)
                        this.out.line(`name: String! @index`)
                        for (let param of f.entity.fields) {
                            let field = `${param.name}: ${param.schemaType}`
                            this.out.line(field)
                        }
                    }
                )
            }
        }
        this.out.write()
    }
}
