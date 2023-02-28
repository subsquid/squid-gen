import {SquidEntity} from './interfaces'

export const block: SquidEntity = {
    name: 'Block',
    fields: [
        {
            name: 'id',
            schemaType: 'ID',
            required: true,
            indexed: false,
        },
        {
            name: 'number',
            schemaType: 'Int',
            required: true,
            indexed: true,
        },
        {
            name: 'timestamp',
            schemaType: 'DateTime',
            required: true,
            indexed: true,
        },
    ],
}

export const transaction: SquidEntity = {
    name: 'Transaction',
    fields: [
        {
            name: 'id',
            schemaType: 'ID',
            required: true,
            indexed: false,
        },
        {
            name: 'blockNumber',
            schemaType: 'Int',
            required: true,
            indexed: true,
        },
        {
            name: 'blockTimestamp',
            schemaType: 'DateTime',
            required: true,
            indexed: true,
        },
        {
            name: 'hash',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
        {
            name: 'to',
            schemaType: 'String',
            required: false,
            indexed: true,
        },
        {
            name: 'from',
            schemaType: 'String',
            required: false,
            indexed: true,
        },
        {
            name: 'success',
            schemaType: 'Boolean',
            required: false,
            indexed: true,
        },
    ],
}

export const event: SquidEntity = {
    name: 'Event',
    fields: [
        {
            name: 'id',
            schemaType: 'ID',
            required: true,
            indexed: false,
        },
        {
            name: 'blockNumber',
            schemaType: 'Int',
            required: true,
            indexed: true,
        },
        {
            name: 'blockTimestamp',
            schemaType: 'DateTime',
            required: true,
            indexed: true,
        },
        {
            name: 'transactionHash',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
        {
            name: 'contract',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
        {
            name: 'eventName',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
    ],
}

export const function_: SquidEntity = {
    name: 'Function',
    fields: [
        {
            name: 'id',
            schemaType: 'ID',
            required: true,
            indexed: false,
        },
        {
            name: 'blockNumber',
            schemaType: 'Int',
            required: true,
            indexed: true,
        },
        {
            name: 'blockTimestamp',
            schemaType: 'DateTime',
            required: true,
            indexed: true,
        },
        {
            name: 'transactionHash',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
        {
            name: 'contract',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
        {
            name: 'functionName',
            schemaType: 'String',
            required: true,
            indexed: true,
        },
        {
            name: 'functionValue',
            schemaType: 'BigInt',
            required: false,
            indexed: false,
        },
        {
            name: 'functionSuccess',
            schemaType: 'Boolean',
            required: false,
            indexed: true,
        },
    ],
}
