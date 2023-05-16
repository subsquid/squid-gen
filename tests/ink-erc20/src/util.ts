import * as ss58 from '@subsquid/ss58'
import {toHex} from '@subsquid/util-internal-hex'

export function fromss58(addr: string) {
    let decodedAddr = ss58.decode(addr)
    return {
        prefix: decodedAddr.prefix,
        hexAddress: toHex(decodedAddr.bytes)
    }
}

export function toss58(prefix: number, hexAddr: string) {
    return ss58.encode({prefix, bytes: Uint8Array.from(Buffer.from(hexAddr.substr(2), 'hex'))})
}

export function normalize(val: unknown) {
    switch (typeof val) {
        case 'object':
            if (val == null) {
                return undefined
            } else if (Buffer.isBuffer(val)) {
                return '0x' + Buffer.from(val.buffer, val.byteOffset, val.byteLength).toString('hex')
            } else if (Array.isArray(val)) {
                return normalizeArray(val)
            } else {
                return normalizeObject(val)
            }
        default:
            return val
    }
}

function normalizeArray(val: unknown[]): any[] {
    let arr = new Array(val.length)
    for (let i = 0; i < val.length; i++) {
        arr[i] = normalize(val[i])
    }
    return arr
}

function normalizeObject(val: any): any {
    let result: any = {}
    for (let key in val) {
        result[key] = normalize(val[key])
    }
    return result
}
