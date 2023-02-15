import {ethers} from 'ethers'

export interface SpecFile {
    abi: ethers.utils.Interface
    events: Record<string, {fragment: ethers.utils.EventFragment}>
    functions: Record<string, {fragment: ethers.utils.FunctionFragment}>
}

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
    functions: SquidFragment[]
}

export interface SquidArchive {
    value: string
    kind: 'url' | 'name'
}
