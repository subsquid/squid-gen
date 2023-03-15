import {toCamelCase, toSnakeCase} from '@subsquid/util-naming'

export function toEntityName(...str: string[]) {
    let name = str.map(toSnakeCase).join('_')
    name = name.slice(0, 62) // slice name to fit max postgress name length (63) and reserve one char for index
    return toUpperCamelCase(name)
}

export function toFieldName(name: string) {
    return toCamelCase(name)
}

function toUpperCamelCase(str: string) {
    let camelCased = toCamelCase(str)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}
