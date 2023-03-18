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
