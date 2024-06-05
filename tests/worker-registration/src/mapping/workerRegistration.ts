import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import {functions, events} from '../abi/0x36e2b147db67e76ab67a4d07c293670ebefcae4e'
import * as eventHandlers from '../handlers/workerRegistration_events'
import * as functionHandlers from '../handlers/workerRegistration_functions'
import {Log, Transaction} from '../processor'

const address = '0x36e2b147db67e76ab67a4d07c293670ebefcae4e'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        if (events.ExcessiveBondReturned.is(log)) {
            return eventHandlers.handleExcessiveBondReturnedEvent(ctx, log)
        }
        if (events.MetadataUpdated.is(log)) {
            return eventHandlers.handleMetadataUpdatedEvent(ctx, log)
        }
        if (events.Paused.is(log)) {
            return eventHandlers.handlePausedEvent(ctx, log)
        }
        if (events.RoleAdminChanged.is(log)) {
            return eventHandlers.handleRoleAdminChangedEvent(ctx, log)
        }
        if (events.RoleGranted.is(log)) {
            return eventHandlers.handleRoleGrantedEvent(ctx, log)
        }
        if (events.RoleRevoked.is(log)) {
            return eventHandlers.handleRoleRevokedEvent(ctx, log)
        }
        if (events.Unpaused.is(log)) {
            return eventHandlers.handleUnpausedEvent(ctx, log)
        }
        if (events.WorkerDeregistered.is(log)) {
            return eventHandlers.handleWorkerDeregisteredEvent(ctx, log)
        }
        if (events.WorkerRegistered.is(log)) {
            return eventHandlers.handleWorkerRegisteredEvent(ctx, log)
        }
        if (events.WorkerWithdrawn.is(log)) {
            return eventHandlers.handleWorkerWithdrawnEvent(ctx, log)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        if (functions.deregister.is(transaction)) {
            return functionHandlers.handleDeregisterFunction(ctx, transaction)
        }
        if (functions.grantRole.is(transaction)) {
            return functionHandlers.handleGrantRoleFunction(ctx, transaction)
        }
        if (functions.pause.is(transaction)) {
            return functionHandlers.handlePauseFunction(ctx, transaction)
        }
        if (functions['register(bytes)'].is(transaction)) {
            return functionHandlers.handleRegister1Function(ctx, transaction)
        }
        if (functions['register(bytes,string)'].is(transaction)) {
            return functionHandlers.handleRegister2Function(ctx, transaction)
        }
        if (functions.renounceRole.is(transaction)) {
            return functionHandlers.handleRenounceRoleFunction(ctx, transaction)
        }
        if (functions.returnExcessiveBond.is(transaction)) {
            return functionHandlers.handleReturnExcessiveBondFunction(ctx, transaction)
        }
        if (functions.revokeRole.is(transaction)) {
            return functionHandlers.handleRevokeRoleFunction(ctx, transaction)
        }
        if (functions.unpause.is(transaction)) {
            return functionHandlers.handleUnpauseFunction(ctx, transaction)
        }
        if (functions.updateMetadata.is(transaction)) {
            return functionHandlers.handleUpdateMetadataFunction(ctx, transaction)
        }
        if (functions.withdraw.is(transaction)) {
            return functionHandlers.handleWithdrawFunction(ctx, transaction)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
