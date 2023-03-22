import {Fragment} from '@subsquid/squid-gen-targets'
import {ethers} from 'ethers'

export interface SpecFile {
    abi: ethers.utils.Interface
    events: Record<string, {fragment: ethers.utils.EventFragment}>
    functions: Record<string, {fragment: ethers.utils.FunctionFragment}>
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
