import {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import {Store} from '../db'
import {EntityBuffer} from '../entityBuffer'
import {ContractFunctionMint} from '../model'
import * as spec from '../abi/0xc36442b4a4522e871399cd717abdd847ab11fe88'
import {Log, Transaction} from '../processor'

const address = '0xc36442b4a4522e871399cd717abdd847ab11fe88'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        switch (transaction.input.slice(0, 10)) {
            case spec.functions['mint'].sighash: {
                let f = spec.functions['mint'].decode(transaction.input)
                EntityBuffer.add(
                    new ContractFunctionMint({
                        id: transaction.id,
                        blockNumber: transaction.block.height,
                        blockTimestamp: new Date(transaction.block.timestamp),
                        transactionHash: transaction.hash,
                        contract: transaction.to,
                        functionName: 'mint',
                        functionValue: transaction.value,
                        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                        params: toJSON(f[0]),
                    })
                )
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
