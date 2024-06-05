import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import {functions, events} from '../abi/0x2591121581d2a7022cd3f66f1a7ccc9560df2152'
import * as eventHandlers from '../handlers/gatewayRegistry_events'
import * as functionHandlers from '../handlers/gatewayRegistry_functions'
import {Log, Transaction} from '../processor'

const address = '0x8a90a1ce5fa8cf71de9e6f76b7d3c0b72feb8c4b'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        if (events.AllocatedCUs.is(log)) {
            return eventHandlers.handleAllocatedCUsEvent(ctx, log)
        }
        if (events.AutoextensionDisabled.is(log)) {
            return eventHandlers.handleAutoextensionDisabledEvent(ctx, log)
        }
        if (events.AutoextensionEnabled.is(log)) {
            return eventHandlers.handleAutoextensionEnabledEvent(ctx, log)
        }
        if (events.AverageBlockTimeChanged.is(log)) {
            return eventHandlers.handleAverageBlockTimeChangedEvent(ctx, log)
        }
        if (events.DefaultStrategyChanged.is(log)) {
            return eventHandlers.handleDefaultStrategyChangedEvent(ctx, log)
        }
        if (events.GatewayAddressChanged.is(log)) {
            return eventHandlers.handleGatewayAddressChangedEvent(ctx, log)
        }
        if (events.Initialized.is(log)) {
            return eventHandlers.handleInitializedEvent(ctx, log)
        }
        if (events.ManaChanged.is(log)) {
            return eventHandlers.handleManaChangedEvent(ctx, log)
        }
        if (events.MaxGatewaysPerClusterChanged.is(log)) {
            return eventHandlers.handleMaxGatewaysPerClusterChangedEvent(ctx, log)
        }
        if (events.MetadataChanged.is(log)) {
            return eventHandlers.handleMetadataChangedEvent(ctx, log)
        }
        if (events.MinStakeChanged.is(log)) {
            return eventHandlers.handleMinStakeChangedEvent(ctx, log)
        }
        if (events.Paused.is(log)) {
            return eventHandlers.handlePausedEvent(ctx, log)
        }
        if (events.Registered.is(log)) {
            return eventHandlers.handleRegisteredEvent(ctx, log)
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
        if (events.Staked.is(log)) {
            return eventHandlers.handleStakedEvent(ctx, log)
        }
        if (events.StrategyAllowed.is(log)) {
            return eventHandlers.handleStrategyAllowedEvent(ctx, log)
        }
        if (events.Unpaused.is(log)) {
            return eventHandlers.handleUnpausedEvent(ctx, log)
        }
        if (events.Unregistered.is(log)) {
            return eventHandlers.handleUnregisteredEvent(ctx, log)
        }
        if (events.Unstaked.is(log)) {
            return eventHandlers.handleUnstakedEvent(ctx, log)
        }
        if (events.UsedStrategyChanged.is(log)) {
            return eventHandlers.handleUsedStrategyChangedEvent(ctx, log)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        if (functions.addStake.is(transaction)) {
            return functionHandlers.handleAddStakeFunction(ctx, transaction)
        }
        if (functions.allocateComputationUnits.is(transaction)) {
            return functionHandlers.handleAllocateComputationUnitsFunction(ctx, transaction)
        }
        if (functions.disableAutoExtension.is(transaction)) {
            return functionHandlers.handleDisableAutoExtensionFunction(ctx, transaction)
        }
        if (functions.enableAutoExtension.is(transaction)) {
            return functionHandlers.handleEnableAutoExtensionFunction(ctx, transaction)
        }
        if (functions.grantRole.is(transaction)) {
            return functionHandlers.handleGrantRoleFunction(ctx, transaction)
        }
        if (functions.initialize.is(transaction)) {
            return functionHandlers.handleInitializeFunction(ctx, transaction)
        }
        if (functions.pause.is(transaction)) {
            return functionHandlers.handlePauseFunction(ctx, transaction)
        }
        if (functions['register(bytes)'].is(transaction)) {
            return functionHandlers.handleRegister1Function(ctx, transaction)
        }
        if (functions['register(bytes,string,address)'].is(transaction)) {
            return functionHandlers.handleRegister2Function(ctx, transaction)
        }
        if (functions['register(bytes,string)'].is(transaction)) {
            return functionHandlers.handleRegister3Function(ctx, transaction)
        }
        if (functions['register(bytes[],string[],address[])'].is(transaction)) {
            return functionHandlers.handleRegister4Function(ctx, transaction)
        }
        if (functions.renounceRole.is(transaction)) {
            return functionHandlers.handleRenounceRoleFunction(ctx, transaction)
        }
        if (functions.revokeRole.is(transaction)) {
            return functionHandlers.handleRevokeRoleFunction(ctx, transaction)
        }
        if (functions.setAverageBlockTime.is(transaction)) {
            return functionHandlers.handleSetAverageBlockTimeFunction(ctx, transaction)
        }
        if (functions.setGatewayAddress.is(transaction)) {
            return functionHandlers.handleSetGatewayAddressFunction(ctx, transaction)
        }
        if (functions.setIsStrategyAllowed.is(transaction)) {
            return functionHandlers.handleSetIsStrategyAllowedFunction(ctx, transaction)
        }
        if (functions.setMana.is(transaction)) {
            return functionHandlers.handleSetManaFunction(ctx, transaction)
        }
        if (functions.setMaxGatewaysPerCluster.is(transaction)) {
            return functionHandlers.handleSetMaxGatewaysPerClusterFunction(ctx, transaction)
        }
        if (functions.setMetadata.is(transaction)) {
            return functionHandlers.handleSetMetadataFunction(ctx, transaction)
        }
        if (functions.setMinStake.is(transaction)) {
            return functionHandlers.handleSetMinStakeFunction(ctx, transaction)
        }
        if (functions['stake(uint256,uint128)'].is(transaction)) {
            return functionHandlers.handleStake1Function(ctx, transaction)
        }
        if (functions['stake(uint256,uint128,bool)'].is(transaction)) {
            return functionHandlers.handleStake2Function(ctx, transaction)
        }
        if (functions.unpause.is(transaction)) {
            return functionHandlers.handleUnpauseFunction(ctx, transaction)
        }
        if (functions['unregister(bytes)'].is(transaction)) {
            return functionHandlers.handleUnregister1Function(ctx, transaction)
        }
        if (functions['unregister(bytes[])'].is(transaction)) {
            return functionHandlers.handleUnregister2Function(ctx, transaction)
        }
        if (functions.unstake.is(transaction)) {
            return functionHandlers.handleUnstakeFunction(ctx, transaction)
        }
        if (functions.useStrategy.is(transaction)) {
            return functionHandlers.handleUseStrategyFunction(ctx, transaction)
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
