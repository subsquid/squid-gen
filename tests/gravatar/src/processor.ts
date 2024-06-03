import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import * as gravatarAbi from './abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
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
        address: ['0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'],
        topic0: [
            gravatarAbi.events['NewGravatar'].topic,
            gravatarAbi.events['UpdatedGravatar'].topic,
        ],
        range: {
            from: 10175243,
        },
    })
    .addTransaction({
        to: ['0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'],
        sighash: [
            gravatarAbi.functions['updateGravatarImage'].sighash,
            gravatarAbi.functions['setMythicalGravatar'].sighash,
            gravatarAbi.functions['updateGravatarName'].sighash,
            gravatarAbi.functions['createGravatar'].sighash,
        ],
        range: {
            from: 10175243,
        },
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
