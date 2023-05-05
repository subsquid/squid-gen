import {Fragment} from '@subsquid/squid-gen-utils'

export const block: Fragment = {
    name: 'block',
    params: [
        {
            name: 'id',
            type: 'id',
            indexed: false,
            static: true,
        },
        {
            name: 'number',
            type: 'int',
            indexed: true,
            static: true,
        },
        {
            name: 'timestamp',
            type: 'datetime',
            indexed: true,
            static: true,
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
            static: true,
        },
        {
            name: 'blockNumber',
            type: 'int',
            indexed: true,
            nullable: true,
            static: true,
        },
        {
            name: 'blockTimestamp',
            type: 'datetime',
            indexed: true,
            static: true,
        },
        {
            name: 'hash',
            type: 'string',
            indexed: true,
            static: true,
        },
        {
            name: 'to',
            type: 'string',
            indexed: true,
            nullable: true,
            static: true,
        },
        {
            name: 'from',
            type: 'string',
            indexed: true,
            nullable: true,
            static: true,
        },
        {
            name: 'status',
            type: 'int',
            indexed: true,
            nullable: true,
            static: true,
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
            static: true,
        },
        {
            name: 'blockNumber',
            type: 'int',
            indexed: true,
            static: true,
        },
        {
            name: 'blockTimestamp',
            type: 'datetime',
            indexed: true,
            static: true,
        },
        {
            name: 'transactionHash',
            type: 'string',
            indexed: true,
            static: true,
        },
        {
            name: 'contract',
            type: 'string',
            indexed: true,
            static: true,
        },
        {
            name: 'eventName',
            type: 'string',
            indexed: true,
            static: true,
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
            static: true,
        },
        {
            name: 'blockNumber',
            type: 'int',
            indexed: true,
            static: true,
        },
        {
            name: 'blockTimestamp',
            type: 'datetime',
            indexed: true,
            static: true,
        },
        {
            name: 'transactionHash',
            type: 'string',
            indexed: true,
            static: true,
        },
        {
            name: 'contract',
            type: 'string',
            indexed: true,
            static: true,
        },
        {
            name: 'functionName',
            type: 'string',
            indexed: true,
            static: true,
        },
        {
            name: 'functionValue',
            type: 'bigint',
            indexed: false,
            nullable: true,
            static: true,
        },
        {
            name: 'functionSuccess',
            type: 'boolean',
            indexed: true,
            nullable: true,
            static: true,
        },
    ],
}
