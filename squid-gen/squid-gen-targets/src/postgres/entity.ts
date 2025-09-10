export interface Entity {
    name: string
    fields: EntityField[]
}

export interface EntityField {
    name: string
    type: string
    indexed: boolean
    required: boolean
}
