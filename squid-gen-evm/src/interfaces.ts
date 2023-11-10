import {Fragment} from '@subsquid/squid-gen-utils'
import {ethers} from 'ethers'

export interface SpecFile {
    abi: ethers.Interface
    events: Record<string, {fragment: ethers.EventFragment}>
    functions: Record<string, {fragment: ethers.FunctionFragment}>
}

export interface SquidContract {
    name: string
    spec: string
    address: string
    events: Record<string, Fragment>
    functions: Record<string, Fragment>
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
