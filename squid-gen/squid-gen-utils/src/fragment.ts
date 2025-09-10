export type ParamType = 'string' | 'boolean' | 'int' | 'bigint' | 'datetime' | 'json' | 'id'

export interface FragmentParam {
    name: string
    type: ParamType
    indexed: boolean
    nullable?: boolean
    static?: boolean
}

export interface Fragment {
    name: string
    params: FragmentParam[]
}
