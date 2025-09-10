import {AbiEvent, AbiFunction} from "@subsquid/evm-abi";
import {Fragment, FragmentParam} from "@subsquid/squid-gen-utils";

export interface SpecFile {
    events: Record<string, AbiEvent<any>>
    functions: Record<string, AbiFunction<any, any>>
}

export type EscapedFragment = {
    name: string
    abiName: string
    params: (FragmentParam & { abiName?: string })[]

}

export interface SquidContract {
    name: string
    spec: string
    address: string
    events: Record<string, EscapedFragment>
    functions: Record<string, EscapedFragment>
    range?: {from?: number; to?: number}
}

export interface SquidArchive {
    value: string
    kind: 'url' | 'name'
}

export type SquidChainRpc = string | {
    url: string
    capacity?: number
    rateLimit?: number
    requestTimeout?: number
    maxBatchCallSize?: number
}
