import {toCamelCase, toSnakeCase} from '@subsquid/util-naming'
import {ParamType} from '../interfaces'

export function toEntityName(str: string) {
    let name = toSnakeCase(str)
    name = name.slice(0, 62) // slice name to fit max postgress name length (63) and reserve one char for repetition index
    return toUpperCamelCase(name)
}

function toUpperCamelCase(str: string) {
    let camelCased = toCamelCase(str)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}

export function toFieldName(name: string) {
    return toCamelCase(name)
}

export function toGqlType(type: ParamType): string {
    switch (type) {
        case 'id':
            return 'ID'
        case 'string':
            return 'String'
        case 'boolean':
            return 'Boolean'
        case 'int':
            return 'Int'
        case 'bigint':
            return 'BigInt'
        case 'datetime':
            return 'DateTime'
        case 'json':
            return 'JSON'
        default:
            throw new Error(`Unsupported param type "${type}"`)
    }
}
