import type {DataHandlerContext} from '@subsquid/evm-processor'
import type {Store} from '../db'
import {functions} from '../abi/0x36e2b147db67e76ab67a4d07c293670ebefcae4e'
import {EntityBuffer} from '../entityBuffer'
import {WorkerRegistrationFunctionDeregister, WorkerRegistrationFunctionGrantRole, WorkerRegistrationFunctionPause, WorkerRegistrationFunctionRegister1, WorkerRegistrationFunctionRegister2, WorkerRegistrationFunctionRenounceRole, WorkerRegistrationFunctionReturnExcessiveBond, WorkerRegistrationFunctionRevokeRole, WorkerRegistrationFunctionUnpause, WorkerRegistrationFunctionUpdateMetadata, WorkerRegistrationFunctionWithdraw} from '../model'
import {Transaction} from '../processor'

export function handleDeregisterFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['deregister'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionDeregister({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'deregister',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
        })
    )
}
export function handleGrantRoleFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['grantRole'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionGrantRole({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'grantRole',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            role: f.role,
            account: f.account,
        })
    )
}
export function handlePauseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['pause'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionPause({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'pause',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        })
    )
}
export function handleRegister1Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['register(bytes)'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionRegister1({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'register_1',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
        })
    )
}
export function handleRegister2Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['register(bytes,string)'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionRegister2({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'register_2',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
            metadata: f.metadata,
        })
    )
}
export function handleRenounceRoleFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['renounceRole'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionRenounceRole({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'renounceRole',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            role: f.role,
            callerConfirmation: f.callerConfirmation,
        })
    )
}
export function handleReturnExcessiveBondFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['returnExcessiveBond'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionReturnExcessiveBond({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'returnExcessiveBond',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
        })
    )
}
export function handleRevokeRoleFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['revokeRole'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionRevokeRole({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'revokeRole',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            role: f.role,
            account: f.account,
        })
    )
}
export function handleUnpauseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['unpause'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionUnpause({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'unpause',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        })
    )
}
export function handleUpdateMetadataFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['updateMetadata'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionUpdateMetadata({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'updateMetadata',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
            metadata: f.metadata,
        })
    )
}
export function handleWithdrawFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['withdraw'].decode(transaction)
    EntityBuffer.add(
        new WorkerRegistrationFunctionWithdraw({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'withdraw',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
        })
    )
}
