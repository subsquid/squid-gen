import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract, SquidEntityField, SquidFragment} from '../util/interfaces'
import {block, event, function_, transaction} from '../util/staticEntities'

export class SchemaCodegen {
    private out: FileOutput

    constructor(outDir: OutDir, private contracts: SquidContract[]) {
        this.out = outDir.file(`schema.graphql`)
    }

    generate() {
        this.out.block(`type Block @entity`, () => {
            this.outputFields(block.fields, true)
        })
        this.out.line()
        this.out.block(`type Transaction @entity`, () => {
            this.outputFields(transaction.fields, true)
        })
        this.out.line()
        this.out.block(`interface Event @query`, () => {
            this.outputFields(event.fields, false)
        })
        this.out.line()
        this.out.block(`interface Function @query`, () => {
            this.outputFields(function_.fields, false)
        })
        for (let contract of this.contracts) {
            for (let e of contract.events) {
                this.out.line()
                let indexedFields = e.entity.fields.filter((f) => f.indexed).map((f) => `"${f.name}"`)
                this.out.block(
                    `type ${e.entity.name} implements Event @entity` +
                        (indexedFields.length > 0 ? ` @index(fields: [${indexedFields.join(', ')}])` : ``),
                    () => {
                        this.outputFields(event.fields, true)
                        this.outputFields(e.entity.fields, true)
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
                        this.outputFields(function_.fields, true)
                        this.outputFields(f.entity.fields, true)
                    }
                )
            }
        }
        this.out.write()
    }

    outputFields(fields: SquidEntityField[], index = false) {
        for (let field of fields) {
            let str = `${field.name}: ${field.schemaType}${field.required ? `!` : ``}`
            if (index && field.indexed) {
                str += ` @index`
            }
            this.out.line(str)
        }
    }
}
