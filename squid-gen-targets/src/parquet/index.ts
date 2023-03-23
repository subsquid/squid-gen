import {isDeepStrictEqual} from 'util'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {DataTarget, DataTargetPrinter} from '../interfaces'
import {Table, TableField} from './table'
import {toTableName, toFieldName, toParquetType, toAliasName} from './naming'
import {URL} from 'url'
import assert from 'assert'
import {Fragment} from '@subsquid/squid-gen-utils'

type TableMap = Map<Fragment, Table>

interface ParquetTargetOptions {
    path: string
}

export class ParquetFileTarget implements DataTarget {
    private tableMap: TableMap

    constructor(private src: OutDir, fragments: Fragment[], private options: ParquetTargetOptions) {
        this.tableMap = new Map<Fragment, Table>()

        let overloads: Record<string, number> = {}
        for (let fragment of fragments) {
            let tableName = toTableName(fragment.name)
            while (true) {
                let repetitionIndex = overloads[tableName]
                if (repetitionIndex == null) {
                    let ols = fragments.filter((f) => toTableName(f.name) === tableName)
                    if (ols.length > 1) {
                        repetitionIndex = overloads[tableName] = 0
                    } else if (ols.length > 0 && tableName !== toTableName(fragment.name)) {
                        repetitionIndex = overloads[tableName] = 0
                    } else {
                        break
                    }
                }
                overloads[tableName] += 1
                tableName += repetitionIndex
            }
            let fields: TableField[] = []
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
                    type: toParquetType(param.type),
                    nullable: param.nullable ?? false,
                })
            }
            this.tableMap.set(fragment, {name: tableName, alias: toAliasName(tableName), fields})
        }
    }

    async generate() {
        let tables = this.src.file('table.ts')
        tables.line(`import {Table, Types, Column} from '@subsquid/file-store-parquet'`)
        for (let t of this.tableMap.values()) {
            tables.line()
            tables.line(`export let ${t.alias} = new Table(`)
            tables.indentation(() => {
                tables.line(`'${t.name}.parquet',`)
                tables.block(``, () => {
                    for (let field of t.fields) {
                        tables.line(`${field.name}: Column(Types.${field.type}, {nullable: ${field.nullable}}),`)
                    }
                })
            })
            tables.line(`)`)
        }
        tables.write()

        let db = this.src.file('db.ts')
        let destType: 'local' | 's3'
        db.lazy(() => {
            db.line(`import {Store as Store_, Database} from '@subsquid/file-store'`)
            switch (destType) {
                case 'local':
                    db.line(`import {LocalDest} from '@subsquid/file-store'`)
                    break
                case 's3':
                    db.line(`import {S3Dest} from '@subsquid/file-store-s3'`)
            }
            db.line(`import * as tables from './table'`)
        })
        db.line()
        db.line(`export let db = new Database({`)
        db.indentation(() => {
            db.line(`tables,`)

            let url = parseUrl(this.options.path)
            if (url == null) {
                destType = 'local'
                db.line(`dest: new LocalDest('${this.options.path}'),`)
            } else {
                assert(url.protocol == 's3:')
                destType = 's3'
                db.line(`dest: new S3Dest('${url.pathname.replace(/^\/+/g, '')}', '${url.host}'),`)
            }

            db.line(`chunkSizeMb: 40,`)
            db.line(`syncIntervalBlocks: 1000,`)
        })
        db.line(`})`)
        db.line()
        db.line(`export type Store = Store_<typeof db extends Database<infer R, any> ? R : never>`)
        db.write()
    }

    createPrinter(out: FileOutput): DataTargetPrinter {
        return new ParquetTargetPrinter(out, this.tableMap)
    }
}

class ParquetTargetPrinter implements DataTargetPrinter {
    constructor(private out: FileOutput, private tableMap: TableMap) {}

    printPreBatch(): void {}

    printPostBatch(): void {}

    printFragmentSave(fragment: Fragment, args: string[]): void {
        let table = this.tableFromFragment(fragment)

        this.out.line(`ctx.store.${table.alias}.write({`)
        this.out.indentation(() => {
            for (let i = 0; i < table.fields.length; i++) {
                this.out.line(`${table.fields[i].name}: ${args[i]},`)
            }
        })
        this.out.line(`})`)
    }

    printImports(): void {}

    private tableFromFragment(fragment: Fragment): Table {
        for (let f of this.tableMap.keys()) {
            if (isDeepStrictEqual(fragment, f)) {
                return this.tableMap.get(f)!
            }
        }
        throw new Error()
    }
}

function parseUrl(str: string) {
    try {
        return new URL(str)
    } catch (e) {
        return undefined
    }
}
