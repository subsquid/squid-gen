import type {DataHandlerContext} from '@subsquid/evm-processor'
import type {Store} from '../db'
import {events} from '../abi/0xdac17f958d2ee523a2206206994597c13d831ec7'
import {Log} from '../processor'

export function handleTransferEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Transfer'].decode(log)
    ctx.store.UsdtEventTransfer.write({
        id: log.id,
        blockNumber: log.block.height,
        blockTimestamp: new Date(log.block.timestamp),
        transactionHash: log.transaction!.hash,
        contract: log.address,
        eventName: 'Transfer',
        from: e.from,
        to: e.to,
        value: e.value,
    })
}
