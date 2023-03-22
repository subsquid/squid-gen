import {EvmBatchProcessor, BatchHandlerContext} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {usdt} from './mapping'
import {db, Store} from './db'

const processor = new EvmBatchProcessor()
processor.setDataSource({
    archive: lookupArchive('eth-mainnet', {type: 'EVM'}),
})
processor.addLog(usdt.address, {
    filter: [
        [
            usdt.spec.events['Transfer'].topic,
        ],
    ],
    data: {
        evmLog: {
            topics: true,
            data: true,
        },
        transaction: {
            hash: true,
            from: true,
        },
    } as const,
})
processor.addTransaction(usdt.address, {
    sighash: [
        usdt.spec.functions['deprecate'].sighash,
        usdt.spec.functions['approve'].sighash,
        usdt.spec.functions['addBlackList'].sighash,
        usdt.spec.functions['transferFrom'].sighash,
        usdt.spec.functions['unpause'].sighash,
        usdt.spec.functions['pause'].sighash,
        usdt.spec.functions['transfer'].sighash,
        usdt.spec.functions['setParams'].sighash,
        usdt.spec.functions['issue'].sighash,
        usdt.spec.functions['redeem'].sighash,
        usdt.spec.functions['removeBlackList'].sighash,
        usdt.spec.functions['transferOwnership'].sighash,
        usdt.spec.functions['destroyBlackFunds'].sighash,
    ],
    data: {
        transaction: {
            hash: true,
            input: true,
            from: true,
            value: true,
        },
    } as const,
})

processor.run(db, async (ctx: BatchHandlerContext<Store, any>) => {
    for (let {header: block, items} of ctx.blocks) {
        ctx.store.Block.write({
            id: block.id,
            number: block.height,
            timestamp: new Date(block.timestamp),
        })
        let lastTxHash: string | undefined
        for (let item of items) {
            if (item.transaction.hash != lastTxHash) {
                lastTxHash = item.transaction.hash
                ctx.store.Transaction.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    hash: item.transaction.hash,
                    to: item.transaction.to,
                    from: item.transaction.from,
                    success: item.transaction.success,
                })
            }

            if (item.address === usdt.address) {
                usdt.parse(ctx, block, item)
            }
        }
    }
})
