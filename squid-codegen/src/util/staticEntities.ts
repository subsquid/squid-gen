import {Fragment} from '@subsquid/squid-gen-targets'

export const block: Fragment = {
    name: 'block',
    params: [
        {
            name: 'id',
            type: 'id',
            indexed: false,
        },
        {
            name: 'number',
            type: 'int',
            indexed: true,
        },
        {
            name: 'timestamp',
            type: 'datetime',
            indexed: true,
        },
    ],
}

export const transaction: Fragment = {
    name: 'transaction',
    params: [
        {
            name: 'id',
            type: 'id',
            indexed: false,
        },
        {
            name: 'blockNumber',
            type: 'int',
            indexed: true,
            nullable: true,
        },
        {
            name: 'blockTimestamp',
            type: 'datetime',
            indexed: true,
        },
        {
            name: 'hash',
            type: 'string',
            indexed: true,
        },
        {
            name: 'to',
            type: 'string',
            indexed: true,
            nullable: true,
        },
        {
            name: 'from',
            type: 'string',
            indexed: true,
            nullable: true,
        },
        {
            name: 'success',
            type: 'boolean',
            indexed: true,
            nullable: true,
        },
    ],
}

export const event: Fragment = {
    name: 'Event',
    params: [
        {
            name: 'id',
            type: 'id',
            indexed: false,
        },
        {
            name: 'blockNumber',
            type: 'int',
            indexed: true,
        },
        {
            name: 'blockTimestamp',
            type: 'datetime',
            indexed: true,
        },
        {
            name: 'transactionHash',
            type: 'string',
            indexed: true,
        },
        {
            name: 'contract',
            type: 'string',
            indexed: true,
        },
        {
            name: 'eventName',
            type: 'string',
            indexed: true,
        },
    ],
}

export const function_: Fragment = {
    name: 'Function',
    params: [
        {
            name: 'id',
            type: 'id',
            indexed: false,
        },
        {
            name: 'blockNumber',
            type: 'int',
            indexed: true,
        },
        {
            name: 'blockTimestamp',
            type: 'datetime',
            indexed: true,
        },
        {
            name: 'transactionHash',
            type: 'string',
            indexed: true,
        },
        {
            name: 'contract',
            type: 'string',
            indexed: true,
        },
        {
            name: 'functionName',
            type: 'string',
            indexed: true,
        },
        {
            name: 'functionValue',
            type: 'bigint',
            indexed: false,
            nullable: true,
        },
        {
            name: 'functionSuccess',
            type: 'boolean',
            indexed: true,
            nullable: true,
        },
    ],
}
