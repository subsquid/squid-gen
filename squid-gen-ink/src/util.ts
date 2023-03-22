import assert from 'assert'
import fs from 'fs'
import {archivesRegistrySubstrate} from '@subsquid/archive-registry'
import {ParamType} from '@subsquid/squid-gen-targets'
import {SquidArchive} from './interfaces'

export function isURL(str: string) {
    try {
        new URL(str)
        return true
    } catch {
        return false
    }
}

export function getArchive(str: string): SquidArchive {
    if (isURL(str)) {
        return {
            value: str,
            kind: 'url',
        }
    } else if (archivesRegistrySubstrate.archives.some((a) => a.network === str)) {
        return {
            value: str,
            kind: 'name',
        }
    } else {
        throw new Error(`Invalid archive "${str}"`)
    }
}

export function readInkMetadata(abi: string) {
    let content = fs.readFileSync(abi, 'utf-8')
    try {
        return JSON.parse(content)
    } catch (e: any) {
        throw new Error(`Failed to parse ${abi}: ${e.message}`)
    }
}

function cleanOptionalType(type: string): {type: string; nullable: boolean} {
    if (!type.includes('|')) return {type, nullable: false}
    let value = type.replace('(', '').replace(')', '').split(' ').join('')
    let [type_, undef] = value.split('|')
    assert(undef == 'undefined', `"${type}" is unexpected`)
    return {type: type_, nullable: true}
}

export function parseTsType(type: string): ParamType {
    if (type === 'string') {
        return 'string'
    } else if (type === 'Uint8Array') {
        return 'string'
    } else if (type === 'boolean') {
        return 'boolean'
    } else if (type === 'number') {
        return 'int'
    } else if (type === 'bigint') {
        return 'bigint'
    } else {
        return 'json'
    }
}

export function getType(type: string): {type: ParamType; nullable: boolean} {
    let {type: type_, nullable} = cleanOptionalType(type)
    return {
        type: parseTsType(type_),
        nullable,
    }
}
