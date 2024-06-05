import type {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import type {Store} from '../db'
import {functions} from '../abi/0x2591121581d2a7022cd3f66f1a7ccc9560df2152'
import {EntityBuffer} from '../entityBuffer'
import {GatewayRegistryFunctionAddStake, GatewayRegistryFunctionAllocateComputationUnits, GatewayRegistryFunctionDisableAutoExtension, GatewayRegistryFunctionEnableAutoExtension, GatewayRegistryFunctionGrantRole, GatewayRegistryFunctionInitialize, GatewayRegistryFunctionPause, GatewayRegistryFunctionRegister1, GatewayRegistryFunctionRegister2, GatewayRegistryFunctionRegister3, GatewayRegistryFunctionRegister4, GatewayRegistryFunctionRenounceRole, GatewayRegistryFunctionRevokeRole, GatewayRegistryFunctionSetAverageBlockTime, GatewayRegistryFunctionSetGatewayAddress, GatewayRegistryFunctionSetIsStrategyAllowed, GatewayRegistryFunctionSetMana, GatewayRegistryFunctionSetMaxGatewaysPerCluster, GatewayRegistryFunctionSetMetadata, GatewayRegistryFunctionSetMinStake, GatewayRegistryFunctionStake1, GatewayRegistryFunctionStake2, GatewayRegistryFunctionUnpause, GatewayRegistryFunctionUnregister1, GatewayRegistryFunctionUnregister2, GatewayRegistryFunctionUnstake, GatewayRegistryFunctionUseStrategy} from '../model'
import {Transaction} from '../processor'

export function handleAddStakeFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['addStake'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionAddStake({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'addStake',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            amount: f.amount,
        })
    )
}
export function handleAllocateComputationUnitsFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['allocateComputationUnits'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionAllocateComputationUnits({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'allocateComputationUnits',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            workerIds: toJSON(f.workerIds),
            cus: toJSON(f.cus),
        })
    )
}
export function handleDisableAutoExtensionFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['disableAutoExtension'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionDisableAutoExtension({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'disableAutoExtension',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        })
    )
}
export function handleEnableAutoExtensionFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['enableAutoExtension'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionEnableAutoExtension({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'enableAutoExtension',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        })
    )
}
export function handleGrantRoleFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['grantRole'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionGrantRole({
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
export function handleInitializeFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['initialize'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionInitialize({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'initialize',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            token: f._token,
            router: f._router,
        })
    )
}
export function handlePauseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['pause'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionPause({
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
        new GatewayRegistryFunctionRegister1({
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
    const f = functions['register(bytes,string,address)'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionRegister2({
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
            gatewayAddress: f.gatewayAddress,
        })
    )
}
export function handleRegister3Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['register(bytes,string)'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionRegister3({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'register_3',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
            metadata: f.metadata,
        })
    )
}
export function handleRegister4Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['register(bytes[],string[],address[])'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionRegister4({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'register_4',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: toJSON(f.peerId),
            metadata: toJSON(f.metadata),
            gatewayAddress: toJSON(f.gatewayAddress),
        })
    )
}
export function handleRenounceRoleFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['renounceRole'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionRenounceRole({
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
export function handleRevokeRoleFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['revokeRole'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionRevokeRole({
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
export function handleSetAverageBlockTimeFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setAverageBlockTime'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetAverageBlockTime({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setAverageBlockTime',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            newAverageBlockTime: f._newAverageBlockTime,
        })
    )
}
export function handleSetGatewayAddressFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setGatewayAddress'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetGatewayAddress({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setGatewayAddress',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
            newAddress: f.newAddress,
        })
    )
}
export function handleSetIsStrategyAllowedFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setIsStrategyAllowed'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetIsStrategyAllowed({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setIsStrategyAllowed',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            strategy: f.strategy,
            isAllowed: f.isAllowed,
            isDefault: f.isDefault,
        })
    )
}
export function handleSetManaFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setMana'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetMana({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setMana',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            newMana: f._newMana,
        })
    )
}
export function handleSetMaxGatewaysPerClusterFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setMaxGatewaysPerCluster'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetMaxGatewaysPerCluster({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setMaxGatewaysPerCluster',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            maxGatewaysPerCluster: f._maxGatewaysPerCluster,
        })
    )
}
export function handleSetMetadataFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setMetadata'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetMetadata({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setMetadata',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
            metadata: f.metadata,
        })
    )
}
export function handleSetMinStakeFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setMinStake'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionSetMinStake({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setMinStake',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            minStake: f._minStake,
        })
    )
}
export function handleStake1Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['stake(uint256,uint128)'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionStake1({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'stake_1',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            amount: f.amount,
            durationBlocks: f.durationBlocks,
        })
    )
}
export function handleStake2Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['stake(uint256,uint128,bool)'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionStake2({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'stake_2',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            amount: f.amount,
            durationBlocks: f.durationBlocks,
            withAutoExtension: f.withAutoExtension,
        })
    )
}
export function handleUnpauseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['unpause'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionUnpause({
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
export function handleUnregister1Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['unregister(bytes)'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionUnregister1({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'unregister_1',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: f.peerId,
        })
    )
}
export function handleUnregister2Function(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['unregister(bytes[])'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionUnregister2({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'unregister_2',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            peerId: toJSON(f.peerId),
        })
    )
}
export function handleUnstakeFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['unstake'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionUnstake({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'unstake',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        })
    )
}
export function handleUseStrategyFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['useStrategy'].decode(transaction)
    EntityBuffer.add(
        new GatewayRegistryFunctionUseStrategy({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'useStrategy',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            strategy: f.strategy,
        })
    )
}
