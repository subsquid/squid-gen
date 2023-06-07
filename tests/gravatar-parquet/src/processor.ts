import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import * as usdtAbi from './abi/0xdac17f958d2ee523a2206206994597c13d831ec7'

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('eth-mainnet', {type: 'EVM'}),
    })
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
    .addLog({
        address: ['0xdac17f958d2ee523a2206206994597c13d831ec7'],
        topic0: [
            usdtAbi.events['Transfer'].topic,
        ],
    })
    .addTransaction({
        to: ['0xdac17f958d2ee523a2206206994597c13d831ec7'],
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

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
