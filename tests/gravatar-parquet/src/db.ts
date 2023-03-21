import {Store as Store_, Database} from '@subsquid/file-store'
import {LocalDest} from '@subsquid/file-store'
import * as tables from './table'

export let db = new Database({
    tables,
    dest: new LocalDest('./data'),
    chunkSizeMb: 40,
    syncIntervalBlocks: 1000,
})

export type Store = Store_<typeof db extends Database<infer R, any> ? R : never>
