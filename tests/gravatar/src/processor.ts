import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import * as contractAbi from './abi/0xc36442b4a4522e871399cd717abdd847ab11fe88'

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
    .addTransaction({
        to: ['0xc36442b4a4522e871399cd717abdd847ab11fe88'],
        sighash: [
            contractAbi.functions['mint'].sighash,
        ],
        range: {
            from: 12369651,
        },
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
