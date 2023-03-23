import {ParamType} from '@subsquid/squid-gen-utils'
import {toCamelCase, toSnakeCase} from '@subsquid/util-naming'

export function toTableName(str: string) {
    return toSnakeCase(str)
}

export function toAliasName(str: string) {
    return toUpperCamelCase(str)
}

function toUpperCamelCase(str: string) {
    let camelCased = toCamelCase(str)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}

export function toFieldName(name: string) {
    return toCamelCase(name)
}

export function toParquetType(type: ParamType): string {
    switch (type) {
        case 'id':
        case 'string':
            return 'String()'
        case 'boolean':
            return 'Boolean()'
        case 'int':
            return 'Int64()'
        case 'bigint':
            return 'Decimal(38)'
        case 'datetime':
            return 'Timestamp()'
        case 'json':
            return 'JSON()'
        default:
            throw new Error(`Unsupported param type "${type}"`)
    }
}
