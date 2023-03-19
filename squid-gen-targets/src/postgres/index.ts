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
                let overloadIndex = overloads[entityName]
                if (overloadIndex == null) {
                    let ols = fragments.filter((f) => toEntityName(f.name) === entityName)
                    if (ols.length > 1) {
                        overloadIndex = overloads[entityName] = 0
                    } else if (ols.length > 0 && entityName !== toEntityName(fragment.name)) {
                        overloadIndex = overloads[entityName] = 0
                    } else {
                        break
                    }
                }
                overloads[entityName] += 1
                entityName += overloadIndex
            }
            let fields: EntityField[] = []
            let overlaps: Record<string, number> = {}
            for (let param of fragment.params) {
                let fieldName = toFieldName(param.name)
                while (true) {
                    let overlapIndex = overlaps[fieldName]
                    if (overlapIndex == null) {
                        let ols = fragment.params.filter((p) => toFieldName(p.name) === fieldName)
                        if (ols.length > 1) {
                            overlapIndex = overlaps[fieldName] = 0
                        } else if (ols.length > 0 && fieldName !== toFieldName(param.name)) {
                            overlapIndex = overlaps[fieldName] = 0
                        } else {
                            break
                        }
                    }
                    overlaps[fieldName] += 1
                    fieldName += overlapIndex
                    // logger.warn(`"${param.name}" param renamed to "${fieldName}" for ${entityName} due to collision`)
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
        let out = this.src.file('../schema.graphql')
        for (let e of this.entityMap.values()) {
            let indexedFields = e.fields.filter((f) => f.indexed).map((f) => `"${f.name}"`)
            out.block(
                `type ${e.name} @entity` +
                    (indexedFields.length > 0 ? ` @index(fields: [${indexedFields.join(', ')}])` : ``),
                () => {
                    for (let field of e.fields) {
                        let str = `${field.name}: ${field.type}${field.required ? `!` : ``}`
                        if (field.indexed) {
                            str += ` @index`
                        }
                        out.line(str)
                    }
                }
            )
            out.line()
        }
        out.write()

        await spawnAsync(`squid-typeorm-codegen`, [])
    }

    createPrinter(out: FileOutput): DataTargetPrinter {
        return new PostgresTargetPrinter(out, this.entityMap)
    }
}

class PostgresTargetPrinter implements DataTargetPrinter {
    private models = new Set<string>()

    constructor(private out: FileOutput, private entityMap: EntityMap) {}

    printPreBatch(): void {
        this.out.line(`let entityBuffer: Record<string, any[]> = {}`)
        this.out.line()
        this.out.block(`let addEntity = (e: any) =>`, () => {
            this.out.line(`let b = entityBuffer[e.constructor.name]`)
            this.out.block(`if (b == null)`, () => {
                this.out.line(`b = []`)
                this.out.line(`entityBuffer[e.constructor.name] = b`)
            })
            this.out.line(`b.push(e)`)
        })
        this.out.line()
    }

    printFragmentSave(fragment: Fragment, varName: string): void {
        let entity = this.entityFromFragment(fragment)
        this.models.add(entity.name)
        this.out.line(`addEntity(${varName})`)
    }

    printPostBatch(): void {
        this.out.block(`for (let e in entityBuffer)`, () => {
            this.out.line(`await ctx.store.insert(entityBuffer[e])`)
        })
    }

    printImports(): void {
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

    private entityFromFragment(fragment: Fragment): Entity {
        for (let f of this.entityMap.keys()) {
            if (isDeepStrictEqual(fragment, f)) {
                return this.entityMap.get(f)!
            }
        }
        throw new Error()
    }
}
