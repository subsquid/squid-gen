import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import * as spec from '../abi/0xdac17f958d2ee523a2206206994597c13d831ec7'
import {Log, Transaction} from '../processor'

const address = '0xdac17f958d2ee523a2206206994597c13d831ec7'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['Transfer'].topic: {
                let e = spec.events['Transfer'].decode(log)
                ctx.store.UsdtEventTransfer.write({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log.transactionHash,
                    contract: log.address,
                    eventName: 'Transfer',
                    from: e[0],
                    to: e[1],
                    value: e[2],
                })
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        switch (transaction.input.slice(0, 10)) {
            case spec.functions['deprecate'].sighash: {
                let f = spec.functions['deprecate'].decode(transaction.input)
                ctx.store.UsdtFunctionDeprecate.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'deprecate',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    upgradedAddress: f[0],
                })
                break
            }
            case spec.functions['approve'].sighash: {
                let f = spec.functions['approve'].decode(transaction.input)
                ctx.store.UsdtFunctionApprove.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'approve',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    spender: f[0],
                    value: f[1],
                })
                break
            }
            case spec.functions['addBlackList'].sighash: {
                let f = spec.functions['addBlackList'].decode(transaction.input)
                ctx.store.UsdtFunctionAddBlackList.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'addBlackList',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    evilUser: f[0],
                })
                break
            }
            case spec.functions['transferFrom'].sighash: {
                let f = spec.functions['transferFrom'].decode(transaction.input)
                ctx.store.UsdtFunctionTransferFrom.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'transferFrom',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    from: f[0],
                    to: f[1],
                    value: f[2],
                })
                break
            }
            case spec.functions['unpause'].sighash: {
                let f = spec.functions['unpause'].decode(transaction.input)
                ctx.store.UsdtFunctionUnpause.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'unpause',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                })
                break
            }
            case spec.functions['pause'].sighash: {
                let f = spec.functions['pause'].decode(transaction.input)
                ctx.store.UsdtFunctionPause.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'pause',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                })
                break
            }
            case spec.functions['transfer'].sighash: {
                let f = spec.functions['transfer'].decode(transaction.input)
                ctx.store.UsdtFunctionTransfer.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'transfer',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    to: f[0],
                    value: f[1],
                })
                break
            }
            case spec.functions['setParams'].sighash: {
                let f = spec.functions['setParams'].decode(transaction.input)
                ctx.store.UsdtFunctionSetParams.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'setParams',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    newBasisPoints: f[0],
                    newMaxFee: f[1],
                })
                break
            }
            case spec.functions['issue'].sighash: {
                let f = spec.functions['issue'].decode(transaction.input)
                ctx.store.UsdtFunctionIssue.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'issue',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    amount: f[0],
                })
                break
            }
            case spec.functions['redeem'].sighash: {
                let f = spec.functions['redeem'].decode(transaction.input)
                ctx.store.UsdtFunctionRedeem.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'redeem',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    amount: f[0],
                })
                break
            }
            case spec.functions['removeBlackList'].sighash: {
                let f = spec.functions['removeBlackList'].decode(transaction.input)
                ctx.store.UsdtFunctionRemoveBlackList.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'removeBlackList',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    clearedUser: f[0],
                })
                break
            }
            case spec.functions['transferOwnership'].sighash: {
                let f = spec.functions['transferOwnership'].decode(transaction.input)
                ctx.store.UsdtFunctionTransferOwnership.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'transferOwnership',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    newOwner: f[0],
                })
                break
            }
            case spec.functions['destroyBlackFunds'].sighash: {
                let f = spec.functions['destroyBlackFunds'].decode(transaction.input)
                ctx.store.UsdtFunctionDestroyBlackFunds.write({
                    id: transaction.id,
                    blockNumber: transaction.block.height,
                    blockTimestamp: new Date(transaction.block.timestamp),
                    transactionHash: transaction.hash,
                    contract: transaction.to!,
                    functionName: 'destroyBlackFunds',
                    functionValue: transaction.value,
                    functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                    blackListedUser: f[0],
                })
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
