import type {DataHandlerContext} from '@subsquid/evm-processor'
import type {Store} from '../db'
import {events} from '../abi/0x36e2b147db67e76ab67a4d07c293670ebefcae4e'
import {EntityBuffer} from '../entityBuffer'
import {WorkerRegistrationEventExcessiveBondReturned, WorkerRegistrationEventMetadataUpdated, WorkerRegistrationEventPaused, WorkerRegistrationEventRoleAdminChanged, WorkerRegistrationEventRoleGranted, WorkerRegistrationEventRoleRevoked, WorkerRegistrationEventUnpaused, WorkerRegistrationEventWorkerDeregistered, WorkerRegistrationEventWorkerRegistered, WorkerRegistrationEventWorkerWithdrawn} from '../model'
import {Log} from '../processor'

export function handleExcessiveBondReturnedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['ExcessiveBondReturned'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventExcessiveBondReturned({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'ExcessiveBondReturned',
            workerId: e.workerId,
            amount: e.amount,
        })
    )
}
export function handleMetadataUpdatedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['MetadataUpdated'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventMetadataUpdated({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'MetadataUpdated',
            workerId: e.workerId,
            metadata: e.metadata,
        })
    )
}
export function handlePausedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Paused'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventPaused({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Paused',
            account: e.account,
        })
    )
}
export function handleRoleAdminChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['RoleAdminChanged'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventRoleAdminChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'RoleAdminChanged',
            role: e.role,
            previousAdminRole: e.previousAdminRole,
            newAdminRole: e.newAdminRole,
        })
    )
}
export function handleRoleGrantedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['RoleGranted'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventRoleGranted({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'RoleGranted',
            role: e.role,
            account: e.account,
            sender: e.sender,
        })
    )
}
export function handleRoleRevokedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['RoleRevoked'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventRoleRevoked({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'RoleRevoked',
            role: e.role,
            account: e.account,
            sender: e.sender,
        })
    )
}
export function handleUnpausedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Unpaused'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventUnpaused({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Unpaused',
            account: e.account,
        })
    )
}
export function handleWorkerDeregisteredEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['WorkerDeregistered'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventWorkerDeregistered({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'WorkerDeregistered',
            workerId: e.workerId,
            account: e.account,
            deregistedAt: e.deregistedAt,
        })
    )
}
export function handleWorkerRegisteredEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['WorkerRegistered'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventWorkerRegistered({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'WorkerRegistered',
            workerId: e.workerId,
            peerId: e.peerId,
            registrar: e.registrar,
            registeredAt: e.registeredAt,
            metadata: e.metadata,
        })
    )
}
export function handleWorkerWithdrawnEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['WorkerWithdrawn'].decode(log)
    EntityBuffer.add(
        new WorkerRegistrationEventWorkerWithdrawn({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'WorkerWithdrawn',
            workerId: e.workerId,
            account: e.account,
        })
    )
}
