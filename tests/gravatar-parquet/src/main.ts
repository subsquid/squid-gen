import {usdt} from './mapping'
import {processor} from './processor'
import {db, Store} from './db'

processor.run(db, async (ctx) => {
    for (let block of ctx.blocks) {
        ctx.store.Block.write({
            id: block.header.id,
            number: block.header.height,
            timestamp: new Date(block.header.timestamp),
        })

        for (let log of block.logs) {
            if (log.address === '0xdac17f958d2ee523a2206206994597c13d831ec7') {
                usdt.parseEvent(ctx, log)
            }
        }

        for (let transaction of block.transactions) {
            if (transaction.to === '0xdac17f958d2ee523a2206206994597c13d831ec7') {
                usdt.parseFunction(ctx, transaction)
            }

            ctx.store.Transaction.write({
                id: transaction.id,
                blockNumber: block.header.height,
                blockTimestamp: new Date(block.header.timestamp),
                hash: transaction.hash,
                to: transaction.to,
                from: transaction.from,
                status: transaction.status,
            })
        }
    }

})
