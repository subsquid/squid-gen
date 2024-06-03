import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import {functions, events} from '../abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'
import * as eventHandlers from '../handlers/gravatar_events'
import * as functionHandlers from '../handlers/gravatar_functions'
import {Log, Transaction} from '../processor'

const address = '0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        if (events['NewGravatar'].is(log)) {
            return eventHandlers.handleNewGravatarEvent(ctx, log)
        }
        if (events['UpdatedGravatar'].is(log)) {
            return eventHandlers.handleUpdatedGravatarEvent(ctx, log)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        if (functions['updateGravatarImage'].is(transaction)) {
            return functionHandlers.handleUpdateGravatarImageFunction(ctx, transaction)
        }
        if (functions['setMythicalGravatar'].is(transaction)) {
            return functionHandlers.handleSetMythicalGravatarFunction(ctx, transaction)
        }
        if (functions['updateGravatarName'].is(transaction)) {
            return functionHandlers.handleUpdateGravatarNameFunction(ctx, transaction)
        }
        if (functions['createGravatar'].is(transaction)) {
            return functionHandlers.handleCreateGravatarFunction(ctx, transaction)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
