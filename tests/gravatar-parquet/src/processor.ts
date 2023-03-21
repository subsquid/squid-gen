import {EvmBatchProcessor, BatchHandlerContext} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {gravatar} from './mapping'
import {db, Store} from './db'

const processor = new EvmBatchProcessor()
processor.setDataSource({
    archive: lookupArchive('eth-mainnet', {type: 'EVM'}),
})
processor.addLog(gravatar.address, {
    filter: [
        [
            gravatar.spec.events['NewGravatar'].topic,
            gravatar.spec.events['UpdatedGravatar'].topic,
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
processor.addTransaction(gravatar.address, {
    sighash: [
        gravatar.spec.functions['updateGravatarImage'].sighash,
        gravatar.spec.functions['setMythicalGravatar'].sighash,
        gravatar.spec.functions['updateGravatarName'].sighash,
        gravatar.spec.functions['createGravatar'].sighash,
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

            if (item.address === gravatar.address) {
                gravatar.parse(ctx, block, item)
            }
        }
    }
})
