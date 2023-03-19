import assert from 'assert'
import {spawn} from 'child_process'
import fs from "fs"
import {archivesRegistrySubstrate} from '@subsquid/archive-registry'
import {SquidArchive} from './interfaces'

export async function spawnAsync(command: string, args: string[]) {
    return await new Promise<number>((resolve, reject) => {
        let proc = spawn(command, args, {
            stdio: 'inherit',
            shell: process.platform == 'win32',
        })

        proc.on('error', (err) => {
            reject(err)
        })

        proc.on('close', (code) => {
            if (code == 0) {
                resolve(code)
            } else {
                reject(`error: command "${command}" exited with code ${code}`)
            }
        })
    })
}

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
    } catch(e: any) {
        throw new Error(`Failed to parse ${abi}: ${e.message}`)
    }
}

function cleanOptionalType(type: string): {type: string, optional: boolean} {
    if (!type.includes('|')) return {type, optional: false}
    let value = type.replace('(', '').replace(')', '').split(' ').join('')
    let [type_, undef] = value.split('|')
    assert(undef == 'undefined', `"${type}" is unexpected`)
    return {type: type_, optional: true}
}

function tsTypeToGqlType(type: string) {
    if (type === 'string') {
        return 'String'
    } else if (type === 'Uint8Array') {
        return 'Bytes'
    } else if (type === 'boolean') {
        return 'Boolean'
    } else if (type === 'number') {
        return 'Int'
    } else if (type === 'bigint') {
        return 'BigInt'
    } else {
        return 'JSON'
    }
}

export function parseTsType(type: string): {schemaType: string, required: boolean} {
    let {type: type_, optional} = cleanOptionalType(type)
    return {schemaType: tsTypeToGqlType(type_), required: !optional}
}
