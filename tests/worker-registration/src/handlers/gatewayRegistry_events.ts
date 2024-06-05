import type {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import type {Store} from '../db'
import {events} from '../abi/0x2591121581d2a7022cd3f66f1a7ccc9560df2152'
import {EntityBuffer} from '../entityBuffer'
import {GatewayRegistryEventAllocatedCUs, GatewayRegistryEventAutoextensionDisabled, GatewayRegistryEventAutoextensionEnabled, GatewayRegistryEventAverageBlockTimeChanged, GatewayRegistryEventDefaultStrategyChanged, GatewayRegistryEventGatewayAddressChanged, GatewayRegistryEventInitialized, GatewayRegistryEventManaChanged, GatewayRegistryEventMaxGatewaysPerClusterChanged, GatewayRegistryEventMetadataChanged, GatewayRegistryEventMinStakeChanged, GatewayRegistryEventPaused, GatewayRegistryEventRegistered, GatewayRegistryEventRoleAdminChanged, GatewayRegistryEventRoleGranted, GatewayRegistryEventRoleRevoked, GatewayRegistryEventStaked, GatewayRegistryEventStrategyAllowed, GatewayRegistryEventUnpaused, GatewayRegistryEventUnregistered, GatewayRegistryEventUnstaked, GatewayRegistryEventUsedStrategyChanged} from '../model'
import {Log} from '../processor'

export function handleAllocatedCUsEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['AllocatedCUs'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventAllocatedCUs({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'AllocatedCUs',
            gateway: e.gateway,
            peerId: e.peerId,
            workerIds: toJSON(e.workerIds),
            shares: toJSON(e.shares),
        })
    )
}
export function handleAutoextensionDisabledEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['AutoextensionDisabled'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventAutoextensionDisabled({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'AutoextensionDisabled',
            gatewayOperator: e.gatewayOperator,
            lockEnd: e.lockEnd,
        })
    )
}
export function handleAutoextensionEnabledEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['AutoextensionEnabled'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventAutoextensionEnabled({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'AutoextensionEnabled',
            gatewayOperator: e.gatewayOperator,
        })
    )
}
export function handleAverageBlockTimeChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['AverageBlockTimeChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventAverageBlockTimeChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'AverageBlockTimeChanged',
            newBlockTime: e.newBlockTime,
        })
    )
}
export function handleDefaultStrategyChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['DefaultStrategyChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventDefaultStrategyChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'DefaultStrategyChanged',
            strategy: e.strategy,
        })
    )
}
export function handleGatewayAddressChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['GatewayAddressChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventGatewayAddressChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'GatewayAddressChanged',
            gatewayOperator: e.gatewayOperator,
            peerId: e.peerId,
            newAddress: e.newAddress,
        })
    )
}
export function handleInitializedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Initialized'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventInitialized({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Initialized',
            version: e.version,
        })
    )
}
export function handleManaChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['ManaChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventManaChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'ManaChanged',
            newCuPerSqd: e.newCuPerSQD,
        })
    )
}
export function handleMaxGatewaysPerClusterChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['MaxGatewaysPerClusterChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventMaxGatewaysPerClusterChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'MaxGatewaysPerClusterChanged',
            newAmount: e.newAmount,
        })
    )
}
export function handleMetadataChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['MetadataChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventMetadataChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'MetadataChanged',
            gatewayOperator: e.gatewayOperator,
            peerId: e.peerId,
            metadata: e.metadata,
        })
    )
}
export function handleMinStakeChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['MinStakeChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventMinStakeChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'MinStakeChanged',
            newAmount: e.newAmount,
        })
    )
}
export function handlePausedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Paused'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventPaused({
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
export function handleRegisteredEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Registered'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventRegistered({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Registered',
            gatewayOperator: e.gatewayOperator,
            paramId: e.id,
            peerId: e.peerId,
        })
    )
}
export function handleRoleAdminChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['RoleAdminChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventRoleAdminChanged({
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
        new GatewayRegistryEventRoleGranted({
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
        new GatewayRegistryEventRoleRevoked({
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
export function handleStakedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Staked'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventStaked({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Staked',
            gatewayOperator: e.gatewayOperator,
            amount: e.amount,
            lockStart: e.lockStart,
            lockEnd: e.lockEnd,
            computationUnits: e.computationUnits,
        })
    )
}
export function handleStrategyAllowedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['StrategyAllowed'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventStrategyAllowed({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'StrategyAllowed',
            strategy: e.strategy,
            isAllowed: e.isAllowed,
        })
    )
}
export function handleUnpausedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Unpaused'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventUnpaused({
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
export function handleUnregisteredEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Unregistered'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventUnregistered({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Unregistered',
            gatewayOperator: e.gatewayOperator,
            peerId: e.peerId,
        })
    )
}
export function handleUnstakedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['Unstaked'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventUnstaked({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'Unstaked',
            gatewayOperator: e.gatewayOperator,
            amount: e.amount,
        })
    )
}
export function handleUsedStrategyChangedEvent(ctx: DataHandlerContext<Store>, log: Log) {
    const e = events['UsedStrategyChanged'].decode(log)
    EntityBuffer.add(
        new GatewayRegistryEventUsedStrategyChanged({
            id: log.id,
            blockNumber: log.block.height,
            blockTimestamp: new Date(log.block.timestamp),
            transactionHash: log.transaction!.hash,
            contract: log.address,
            eventName: 'UsedStrategyChanged',
            gatewayOperator: e.gatewayOperator,
            strategy: e.strategy,
        })
    )
}
