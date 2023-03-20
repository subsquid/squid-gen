import {Output} from '@subsquid/util-internal-code-printer'

export type ParamType = 'string' | 'boolean' | 'int' | 'bigint' | 'datetime' | 'json' | 'id'

export interface FragmentParam {
    name: string
    type: ParamType
    indexed: boolean
    nullable?: boolean
}

export interface Fragment {
    name: string
    params: FragmentParam[]
}

export interface DataTarget {
    generate(): Promise<void>

    createPrinter(out: Output): DataTargetPrinter
}

export interface DataTargetPrinter {
    printImports(): void

    printPreBatch(): void

    printFragmentSave(fragment: Fragment, args: string[]): void

    printPostBatch(): void
}
