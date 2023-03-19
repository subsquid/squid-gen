import {spawn} from 'child_process'
import path from 'upath'

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

export function resolveModule(from: string, to: string) {
    return path.normalizeSafe(path.joinSafe('./', path.relative(from, to)))
}
