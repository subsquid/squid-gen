import {Fragment} from '@subsquid/squid-gen-utils'
import {Output} from '@subsquid/util-internal-code-printer'

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
