import {spawn} from 'child_process'
import {archivesRegistryEVM} from '@subsquid/archive-registry'
import {SquidArchive} from './interfaces'
import {ParamType} from '@subsquid/squid-gen-utils'
import type {Codec} from "@subsquid/evm-codec";

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
    } else if (archivesRegistryEVM().archives.some((a) => a.network === str)) {
        return {
            value: str,
            kind: 'name',
        }
    } else {
        throw new Error(`Invalid archive "${str}"`)
    }
}

export function getType(param: Codec<any>): ParamType {
    if (param.baseType === "struct" || param.baseType === "array") {
        return 'json'
    }

    if (param.baseType === 'address' || param.baseType === 'string' || param.baseType === 'bytes') {
        return 'string'
    }

    if (param.baseType === 'bool') {
        return 'boolean'
    }
    if (param.baseType === 'int') {
        return 'bigint'
    }

    throw new Error('unknown type')
}
