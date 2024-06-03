import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import {functions, events} from '../abi/0xdac17f958d2ee523a2206206994597c13d831ec7'
import * as eventHandlers from '../handlers/usdt_events'
import * as functionHandlers from '../handlers/usdt_functions'
import {Log, Transaction} from '../processor'

const address = '0xdac17f958d2ee523a2206206994597c13d831ec7'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        if (events['Transfer'].is(log)) {
            return eventHandlers.handleTransferEvent(ctx, log)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        if (functions['deprecate'].is(transaction)) {
            return functionHandlers.handleDeprecateFunction(ctx, transaction)
        }
        if (functions['approve'].is(transaction)) {
            return functionHandlers.handleApproveFunction(ctx, transaction)
        }
        if (functions['addBlackList'].is(transaction)) {
            return functionHandlers.handleAddBlackListFunction(ctx, transaction)
        }
        if (functions['transferFrom'].is(transaction)) {
            return functionHandlers.handleTransferFromFunction(ctx, transaction)
        }
        if (functions['unpause'].is(transaction)) {
            return functionHandlers.handleUnpauseFunction(ctx, transaction)
        }
        if (functions['pause'].is(transaction)) {
            return functionHandlers.handlePauseFunction(ctx, transaction)
        }
        if (functions['transfer'].is(transaction)) {
            return functionHandlers.handleTransferFunction(ctx, transaction)
        }
        if (functions['setParams'].is(transaction)) {
            return functionHandlers.handleSetParamsFunction(ctx, transaction)
        }
        if (functions['issue'].is(transaction)) {
            return functionHandlers.handleIssueFunction(ctx, transaction)
        }
        if (functions['redeem'].is(transaction)) {
            return functionHandlers.handleRedeemFunction(ctx, transaction)
        }
        if (functions['removeBlackList'].is(transaction)) {
            return functionHandlers.handleRemoveBlackListFunction(ctx, transaction)
        }
        if (functions['transferOwnership'].is(transaction)) {
            return functionHandlers.handleTransferOwnershipFunction(ctx, transaction)
        }
        if (functions['destroyBlackFunds'].is(transaction)) {
            return functionHandlers.handleDestroyBlackFundsFunction(ctx, transaction)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
