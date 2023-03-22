import {Store as Store_, Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'
import * as tables from './table'

export let db = new Database({
    tables,
    dest: new S3Dest('/data', 'test'),
    chunkSizeMb: 40,
    syncIntervalBlocks: 1000,
})

export type Store = Store_<typeof db extends Database<infer R, any> ? R : never>
