import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import * as workerRegistrationAbi from './abi/0x36e2b147db67e76ab67a4d07c293670ebefcae4e'
import * as gatewayRegistryAbi from './abi/0x2591121581d2a7022cd3f66f1a7ccc9560df2152'

export const processor = new EvmBatchProcessor()
    /// Datalake with historical data for the network
    /// @link https://docs.subsquid.io/subsquid-network/reference/evm-networks/
    .setGateway('https://v2.archive.subsquid.io/network/arbitrum-one')
    /// RPC endpoint to fetch latest blocks.
    /// Set RPC_URL environment variable, or specify ChainRpc endpoint
    /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-rpc-endpoint
    .setRpcEndpoint(process.env.RPC_URL)

    /// Specify which type of data needs to be extracted from the block
    /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields
    .setFields({
            log: {
                topics: true,
                data: true,
                transactionHash: true,
            },
            transaction: {
                hash: true,
                input: true,
                from: true,
                value: true,
                status: true,
        }
    })
    /// Subscribe to events emitted by workerRegistration
    .addLog({
        /// workerRegistration address
        address: ['0x36e2b147db67e76ab67a4d07c293670ebefcae4e'],
        /// Topic0 of subscribed events
        /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields
        topic0: [
            workerRegistrationAbi.events['ExcessiveBondReturned'].topic,
            workerRegistrationAbi.events['MetadataUpdated'].topic,
            workerRegistrationAbi.events['Paused'].topic,
            workerRegistrationAbi.events['RoleAdminChanged'].topic,
            workerRegistrationAbi.events['RoleGranted'].topic,
            workerRegistrationAbi.events['RoleRevoked'].topic,
            workerRegistrationAbi.events['Unpaused'].topic,
            workerRegistrationAbi.events['WorkerDeregistered'].topic,
            workerRegistrationAbi.events['WorkerRegistered'].topic,
            workerRegistrationAbi.events['WorkerWithdrawn'].topic,
        ],
        /// Scanned blocks range
        range: {
            from: 208420430,
        },
    })
    /// Subscribe to transactions to the contract
    .addTransaction({
        /// workerRegistration address
        to: ['0x36e2b147db67e76ab67a4d07c293670ebefcae4e'],
        /// Selectors of subscribed methods
        /// @link https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector
        sighash: [
            workerRegistrationAbi.functions['deregister'].sighash,
            workerRegistrationAbi.functions['grantRole'].sighash,
            workerRegistrationAbi.functions['pause'].sighash,
            workerRegistrationAbi.functions['register(bytes)'].sighash,
            workerRegistrationAbi.functions['register(bytes,string)'].sighash,
            workerRegistrationAbi.functions['renounceRole'].sighash,
            workerRegistrationAbi.functions['returnExcessiveBond'].sighash,
            workerRegistrationAbi.functions['revokeRole'].sighash,
            workerRegistrationAbi.functions['unpause'].sighash,
            workerRegistrationAbi.functions['updateMetadata'].sighash,
            workerRegistrationAbi.functions['withdraw'].sighash,
        ],
        /// Scanned blocks range
        range: {
            from: 208420430,
        },
    })
    /// Subscribe to events emitted by gatewayRegistry
    .addLog({
        /// gatewayRegistry address
        address: ['0x8a90a1ce5fa8cf71de9e6f76b7d3c0b72feb8c4b'],
        /// Topic0 of subscribed events
        /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields
        topic0: [
            gatewayRegistryAbi.events['AllocatedCUs'].topic,
            gatewayRegistryAbi.events['AutoextensionDisabled'].topic,
            gatewayRegistryAbi.events['AutoextensionEnabled'].topic,
            gatewayRegistryAbi.events['AverageBlockTimeChanged'].topic,
            gatewayRegistryAbi.events['DefaultStrategyChanged'].topic,
            gatewayRegistryAbi.events['GatewayAddressChanged'].topic,
            gatewayRegistryAbi.events['Initialized'].topic,
            gatewayRegistryAbi.events['ManaChanged'].topic,
            gatewayRegistryAbi.events['MaxGatewaysPerClusterChanged'].topic,
            gatewayRegistryAbi.events['MetadataChanged'].topic,
            gatewayRegistryAbi.events['MinStakeChanged'].topic,
            gatewayRegistryAbi.events['Paused'].topic,
            gatewayRegistryAbi.events['Registered'].topic,
            gatewayRegistryAbi.events['RoleAdminChanged'].topic,
            gatewayRegistryAbi.events['RoleGranted'].topic,
            gatewayRegistryAbi.events['RoleRevoked'].topic,
            gatewayRegistryAbi.events['Staked'].topic,
            gatewayRegistryAbi.events['StrategyAllowed'].topic,
            gatewayRegistryAbi.events['Unpaused'].topic,
            gatewayRegistryAbi.events['Unregistered'].topic,
            gatewayRegistryAbi.events['Unstaked'].topic,
            gatewayRegistryAbi.events['UsedStrategyChanged'].topic,
        ],
        /// Scanned blocks range
        range: {
            from: 208420430,
        },
    })
    /// Subscribe to transactions to the contract
    .addTransaction({
        /// gatewayRegistry address
        to: ['0x8a90a1ce5fa8cf71de9e6f76b7d3c0b72feb8c4b'],
        /// Selectors of subscribed methods
        /// @link https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector
        sighash: [
            gatewayRegistryAbi.functions['addStake'].sighash,
            gatewayRegistryAbi.functions['allocateComputationUnits'].sighash,
            gatewayRegistryAbi.functions['disableAutoExtension'].sighash,
            gatewayRegistryAbi.functions['enableAutoExtension'].sighash,
            gatewayRegistryAbi.functions['grantRole'].sighash,
            gatewayRegistryAbi.functions['initialize'].sighash,
            gatewayRegistryAbi.functions['pause'].sighash,
            gatewayRegistryAbi.functions['register(bytes)'].sighash,
            gatewayRegistryAbi.functions['register(bytes,string,address)'].sighash,
            gatewayRegistryAbi.functions['register(bytes,string)'].sighash,
            gatewayRegistryAbi.functions['register(bytes[],string[],address[])'].sighash,
            gatewayRegistryAbi.functions['renounceRole'].sighash,
            gatewayRegistryAbi.functions['revokeRole'].sighash,
            gatewayRegistryAbi.functions['setAverageBlockTime'].sighash,
            gatewayRegistryAbi.functions['setGatewayAddress'].sighash,
            gatewayRegistryAbi.functions['setIsStrategyAllowed'].sighash,
            gatewayRegistryAbi.functions['setMana'].sighash,
            gatewayRegistryAbi.functions['setMaxGatewaysPerCluster'].sighash,
            gatewayRegistryAbi.functions['setMetadata'].sighash,
            gatewayRegistryAbi.functions['setMinStake'].sighash,
            gatewayRegistryAbi.functions['stake(uint256,uint128)'].sighash,
            gatewayRegistryAbi.functions['stake(uint256,uint128,bool)'].sighash,
            gatewayRegistryAbi.functions['unpause'].sighash,
            gatewayRegistryAbi.functions['unregister(bytes)'].sighash,
            gatewayRegistryAbi.functions['unregister(bytes[])'].sighash,
            gatewayRegistryAbi.functions['unstake'].sighash,
            gatewayRegistryAbi.functions['useStrategy'].sighash,
        ],
        /// Scanned blocks range
        range: {
            from: 208420430,
        },
    })
    /// Uncomment this to specify the number of blocks after which the processor will consider the consensus data final
    /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-finality-confirmation
    // .setFinalityConfirmation(1000)


export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
