import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import * as gravatarAbi from './abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'

export const processor = new EvmBatchProcessor()
    /// Datalake with historical data for the network
    /// @link https://docs.subsquid.io/subsquid-network/reference/evm-networks/
    .setGateway('https://v2.archive.subsquid.io/network/ethereum-mainnet')
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
    /// Subscribe to events emitted by gravatar
    .addLog({
        /// gravatar address
        address: ['0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'],
        /// Topic0 of subscribed events
        /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields
        topic0: [
            gravatarAbi.events['NewGravatar'].topic,
            gravatarAbi.events['UpdatedGravatar'].topic,
        ],
        /// Scanned blocks range
        range: {
            from: 10175243,
        },
    })
    /// Subscribe to transactions to the contract
    .addTransaction({
        /// gravatar address
        to: ['0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'],
        /// Selectors of subscribed methods
        /// @link https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector
        sighash: [
            gravatarAbi.functions['updateGravatarImage'].sighash,
            gravatarAbi.functions['setMythicalGravatar'].sighash,
            gravatarAbi.functions['updateGravatarName'].sighash,
            gravatarAbi.functions['createGravatar'].sighash,
        ],
        /// Scanned blocks range
        range: {
            from: 10175243,
        },
    })
    /// Uncomment this to specify the number of blocks after which the processor will consider the consensus data final
    /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-finality-confirmation
    // .setFinalityConfirmation(1000)


export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
