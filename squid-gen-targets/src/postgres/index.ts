import path from 'path'
import {isDeepStrictEqual} from 'util'
import {resolveModule, spawnAsync} from '@subsquid/squid-gen-utils'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {DataTarget, DataTargetPrinter, Fragment} from '../interfaces'
import {Entity, EntityField} from './entity'
import {toEntityName, toFieldName, toGqlType} from './naming'

type EntityMap = Map<Fragment, Entity>

export class PostgresTarget implements DataTarget {
    private entityMap: EntityMap

    constructor(private src: OutDir, fragments: Fragment[], options: any) {
        this.entityMap = new Map<Fragment, Entity>()

        let overloads: Record<string, number> = {}
        for (let fragment of fragments) {
            let entityName = toEntityName(fragment.name)
            while (true) {
                let repetitionIndex = overloads[entityName]
                if (repetitionIndex == null) {
                    let ols = fragments.filter((f) => toEntityName(f.name) === entityName)
                    if (ols.length > 1) {
                        repetitionIndex = overloads[entityName] = 0
                    } else if (ols.length > 0 && entityName !== toEntityName(fragment.name)) {
                        repetitionIndex = overloads[entityName] = 0
                    } else {
                        break
                    }
                }
                overloads[entityName] += 1
                entityName += repetitionIndex
            }
            let fields: EntityField[] = []
            let overlaps: Record<string, number> = {}
            for (let param of fragment.params) {
                let fieldName = toFieldName(param.name)
                while (true) {
                    let repetitionIndex = overlaps[fieldName]
                    if (repetitionIndex == null) {
                        let ols = fragment.params.filter((p) => toFieldName(p.name) === fieldName)
                        if (ols.length > 1) {
                            repetitionIndex = overlaps[fieldName] = 0
                        } else if (ols.length > 0 && fieldName !== toFieldName(param.name)) {
                            repetitionIndex = overlaps[fieldName] = 0
                        } else {
                            break
                        }
                    }
                    if (param.static) {
                        break
                    } else {
                        overlaps[fieldName] += 1
                        fieldName += repetitionIndex
                    }
                }
                fields.push({
                    name: fieldName,
                    type: toGqlType(param.type),
                    indexed: param.indexed,
                    required: true,
                })
            }
            this.entityMap.set(fragment, {name: entityName, fields})
        }
    }

    async generate() {
        let schema = this.src.file('../schema.graphql')
        for (let e of this.entityMap.values()) {
            let indexedFields = e.fields.filter((f) => f.indexed).map((f) => `"${f.name}"`)
            schema.block(
                `type ${e.name} @entity` +
                    (indexedFields.length > 0 ? ` @index(fields: [${indexedFields.join(', ')}])` : ``),
                () => {
                    for (let field of e.fields) {
                        let str = `${field.name}: ${field.type}${field.required ? `!` : ``}`
                        if (field.indexed) {
                            str += ` @index`
                        }
                        schema.line(str)
                    }
                }
            )
            schema.line()
        }
        schema.write()

        await spawnAsync(`squid-typeorm-codegen`, [])

        let db = this.src.file('db.ts')
        db.line(`import {Store as Store_, TypeormDatabase} from '@subsquid/typeorm-store'`)
        db.line()
        db.line(`export let db = new TypeormDatabase()`)
        db.line(`export type Store = Store_`)
        db.write()

        this.src.add(`entityBuffer.ts`, path.resolve(__dirname, `..`, `..`, `support`, `entityBuffer.ts`))
    }

    createPrinter(out: FileOutput): DataTargetPrinter {
        return new PostgresTargetPrinter(out, this.entityMap)
    }
}

class PostgresTargetPrinter implements DataTargetPrinter {
    private models = new Set<string>()
    private buffer = false

    constructor(private out: FileOutput, private entityMap: EntityMap) {}

    printPreBatch(): void {}

    printPostBatch(): void {
        this.useBuffer()
        this.out.block(`for (let entities of EntityBuffer.flush())`, () => {
            this.out.line(`await ctx.store.insert(entities)`)
        })
    }

    printFragmentSave(fragment: Fragment, args: string[]): void {
        let entity = this.entityFromFragment(fragment)

        this.useBuffer()
        this.useModel(entity.name)
        this.out.line(`EntityBuffer.add(`)
        this.out.indentation(() => {
            this.out.line(`new ${entity.name}({`)
            this.out.indentation(() => {
                for (let i = 0; i < entity.fields.length; i++) {
                    this.out.line(`${entity.fields[i].name}: ${args[i]},`)
                }
            })
            this.out.line(`})`)
        })
        this.out.line(`)`)
    }

    printImports(): void {
        if (this.buffer) {
            this.out.line(
                `import {EntityBuffer} from '${resolveModule(this.out.file, path.resolve(`src`, `entityBuffer`))}'`
            )
        }

        if (this.models.size > 0) {
            this.out.file
            this.out.line(
                `import {${[...this.models].join(`, `)}} from '${resolveModule(
                    this.out.file,
                    path.resolve(`src`, `model`)
                )}'`
            )
        }
    }

    private useModel(name: string) {
        this.models.add(name)
    }

    private useBuffer() {
        this.buffer = true
    }

    private entityFromFragment(fragment: Fragment): Entity {
        for (let f of this.entityMap.keys()) {
            if (isDeepStrictEqual(fragment, f)) {
                return this.entityMap.get(f)!
            }
        }
        throw new Error()
    }
}
