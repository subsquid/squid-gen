import type {DataHandlerContext} from '@subsquid/evm-processor'
import type {Store} from '../db'
import {events} from '../abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'
import {EntityBuffer} from '../entityBuffer'
import {GravatarEventNewGravatar, GravatarEventUpdatedGravatar} from '../model'
import {Log} from '../processor'

export function handleNewGravatarEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['NewGravatar'].decode(log)
    EntityBuffer.add(
        new GravatarEventNewGravatar({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'NewGravatar',
            paramId: e.id,
            owner: e.owner,
            displayName: e.displayName,
            imageUrl: e.imageUrl,
        })
    )
}
export function handleUpdatedGravatarEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['UpdatedGravatar'].decode(log)
    EntityBuffer.add(
        new GravatarEventUpdatedGravatar({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'UpdatedGravatar',
            paramId: e.id,
            owner: e.owner,
            displayName: e.displayName,
            imageUrl: e.imageUrl,
        })
    )
}
