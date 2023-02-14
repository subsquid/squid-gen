import {toCamelCase} from "@subsquid/util-naming"

export function toEntityName(name: string) {
    let camelCased = toCamelCase(name)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}

export function toFieldName(name: string) {
    return toCamelCase(name)
}