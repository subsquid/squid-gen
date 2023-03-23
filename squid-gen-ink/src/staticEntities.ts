import {Fragment} from '@subsquid/squid-gen-utils'

export const block: Fragment = {
    name: 'Block',
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
