export interface Table {
    name: string
    alias: string
    fields: TableField[]
}

export interface TableField {
    name: string
    type: string
    nullable: boolean
}
