import {SubstrateBatchProcessor, BatchContext} from '@subsquid/substrate-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import {ERC20} from './mapping'
import {db, Store} from './db'
import {EntityBuffer} from './entityBuffer'
import {Block} from './model'

const processor = new SubstrateBatchProcessor()
    .setDataSource({
        archive: lookupArchive('shibuya', {type: 'Substrate'}),
    })
    .addContractsContractEmitted(ERC20.address, {
        data: {
            event: {args: true}
        },
    })

processor.run(db, async (ctx: BatchContext<Store, any>) => {
    for (let {header: block, items} of ctx.blocks) {
        EntityBuffer.add(
            new Block({
                id: block.id,
                number: block.height,
                timestamp: new Date(block.timestamp),
            })
        )
        for (let item of items) {

            if (item.kind == 'event' && item.event.name == 'Contracts.ContractEmitted') {
                if (item.event.args.contract == ERC20.address) {
                    ERC20.parse(block, item.event)
                }
            }
        }
    }
    for (let e of EntityBuffer.flush()) {
        await ctx.store.insert(e)
    }
})
