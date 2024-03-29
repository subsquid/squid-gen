import {Fragment} from '@subsquid/squid-gen-utils'

export interface SquidContract {
    name: string
    address: string
    events: Record<string, Fragment>
    range?: {from?: number; to?: number}
}

export interface SquidArchive {
    value: string
    kind: 'url' | 'name'
}
