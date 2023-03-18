export interface SquidEntityField {
    name: string
    schemaType: string
    indexed: boolean
    required: boolean
}

export interface SquidEntity {
    name: string
    fields: SquidEntityField[]
}

export interface SquidFragment {
    name: string
    entity: SquidEntity
}

export interface SquidContract {
    name: string
    address: string
    events: SquidFragment[]
    range?: {from?: number; to?: number}
}

export interface SquidArchive {
    value: string
    kind: 'url' | 'name'
}
