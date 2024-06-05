import {workerRegistration, gatewayRegistry} from './mapping'
import {processor} from './processor'
import {db, Store} from './db'
import {EntityBuffer} from './entityBuffer'
import {Block, Transaction} from './model'

processor.run(db, async (ctx) => {
    for (let block of ctx.blocks) {
        // Use ctx.log for logging. Avoid using `console.log` in squids
        ctx.log.info(`Received block #${block.header.height} with ${block.transactions.length} transactions`)

        EntityBuffer.add(
            new Block({
                id: block.header.id,
                number: block.header.height,
                timestamp: new Date(block.header.timestamp),
            })
        )

        for (let log of block.logs) {
            if (log.address === '0x36e2b147db67e76ab67a4d07c293670ebefcae4e') {
                workerRegistration.parseEvent(ctx, log)
            }
            if (log.address === '0x8a90a1ce5fa8cf71de9e6f76b7d3c0b72feb8c4b') {
                gatewayRegistry.parseEvent(ctx, log)
            }
        }

        for (let transaction of block.transactions) {
            if (transaction.to === '0x36e2b147db67e76ab67a4d07c293670ebefcae4e') {
                workerRegistration.parseFunction(ctx, transaction)
            }
            if (transaction.to === '0x8a90a1ce5fa8cf71de9e6f76b7d3c0b72feb8c4b') {
                gatewayRegistry.parseFunction(ctx, transaction)
            }

            EntityBuffer.add(
                new Transaction({
                    id: transaction.id,
                    blockNumber: block.header.height,
                    blockTimestamp: new Date(block.header.timestamp),
                    hash: transaction.hash,
                    to: transaction.to,
                    from: transaction.from,
                    status: transaction.status,
                })
            )
        }
    }

    for (let entities of EntityBuffer.flush()) {
        await ctx.store.insert(entities)
    }
})
