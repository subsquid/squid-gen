import {spawn} from 'child_process'
import {archivesRegistryEVM} from '@subsquid/archive-registry'
import {SquidArchive} from './interfaces'
import ethers from 'ethers'
import {ParamType} from '@subsquid/squid-gen-targets'

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
    } else if (archivesRegistryEVM.archives.some((a) => a.network === str)) {
        return {
            value: str,
            kind: 'name',
        }
    } else {
        throw new Error(`Invalid archive "${str}"`)
    }
}

export function getType(param: ethers.utils.ParamType): ParamType {
    if (param.baseType === 'array' || param.baseType === 'tuple') {
        return 'json'
    }

    if (param.type === 'address' || param.type === 'string') {
        return 'string'
    }

    if (param.type === 'bool') {
        return 'boolean'
    }

    let match = param.type.match(/^(u?int)([0-9]+)$/)
    if (match) {
        return parseInt(match[2]) < 53 ? 'int' : 'bigint'
    }

    if (param.type.substring(0, 5) === 'bytes') {
        return 'string'
    }

    throw new Error('unknown type')
}
