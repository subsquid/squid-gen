import {toCamelCase} from '@subsquid/util-naming'

export function toEntityName(...str: string[]) {
    return str.map(toUpperCamelCase).join('')
}

export function toFieldName(name: string) {
    return toCamelCase(name)
}

function toUpperCamelCase(str: string) {
    let camelCased = toCamelCase(str)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}
