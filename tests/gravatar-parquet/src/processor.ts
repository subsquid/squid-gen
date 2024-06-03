import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import * as usdtAbi from './abi/0xdac17f958d2ee523a2206206994597c13d831ec7'

export const processor = new EvmBatchProcessor()
    /// Datalake with historical data for the network
    /// @link https://docs.subsquid.io/subsquid-network/reference/evm-networks/
    .setGateway('eth-mainnet')
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
    /// Subscribe to events emitted by usdt
    .addLog({
        /// usdt address
        address: ['0xdac17f958d2ee523a2206206994597c13d831ec7'],
        /// Topic0 of subscribed events
        /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields
        topic0: [
            usdtAbi.events['Transfer'].topic,
        ],
    })
    /// Subscribe to transactions to the contract
    .addTransaction({
        /// usdt address
        to: ['0xdac17f958d2ee523a2206206994597c13d831ec7'],
        /// Selectors of subscribed methods
        /// @link https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector
        sighash: [
            usdtAbi.functions['deprecate'].sighash,
            usdtAbi.functions['approve'].sighash,
            usdtAbi.functions['addBlackList'].sighash,
            usdtAbi.functions['transferFrom'].sighash,
            usdtAbi.functions['unpause'].sighash,
            usdtAbi.functions['pause'].sighash,
            usdtAbi.functions['transfer'].sighash,
            usdtAbi.functions['setParams'].sighash,
            usdtAbi.functions['issue'].sighash,
            usdtAbi.functions['redeem'].sighash,
            usdtAbi.functions['removeBlackList'].sighash,
            usdtAbi.functions['transferOwnership'].sighash,
            usdtAbi.functions['destroyBlackFunds'].sighash,
        ],
    })
    /// Uncomment this to specify the number of blocks after which the processor will consider the consensus data final
    /// @link https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-finality-confirmation
    // .setFinalityConfirmation(1000)


export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
