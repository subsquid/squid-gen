import path from 'upath'

export const SRC = 'src'
export const MODEL = path.join(SRC, 'model')
export const MAPPING = path.join(SRC, 'mapping')
export const ABI = path.join(SRC, 'abi')

export function resolveModule(from: string, to: string) {
    return path.normalizeSafe(path.joinSafe('./', path.relative(from, to)))
}
