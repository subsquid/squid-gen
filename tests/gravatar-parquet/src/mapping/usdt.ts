import {CommonHandlerContext, EvmBlock} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import {Store} from '../db'
import * as spec from '../abi/0xdac17f958d2ee523a2206206994597c13d831ec7'
import {normalize} from '../util'

export {spec}

export const address = '0xdac17f958d2ee523a2206206994597c13d831ec7'

type EventItem = LogItem<{evmLog: {topics: true, data: true}, transaction: {hash: true}}>
type FunctionItem = TransactionItem<{transaction: {hash: true, input: true, value: true, status: true}}>

export function parse(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem | FunctionItem) {
    switch (item.kind) {
        case 'evmLog':
            return parseEvent(ctx, block, item)
        case 'transaction':
            return parseFunction(ctx, block, item)
    }
}

function parseEvent(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: EventItem) {
    try {
        switch (item.evmLog.topics[0]) {
            case spec.events['Transfer'].topic: {
                let e = normalize(spec.events['Transfer'].decode(item.evmLog))
                ctx.store.UsdtEventTransfer.write({
                    id: item.evmLog.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
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
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}

function parseFunction(ctx: CommonHandlerContext<Store>, block: EvmBlock, item: FunctionItem) {
    try {
        switch (item.transaction.input.slice(0, 10)) {
            case spec.functions['deprecate'].sighash: {
                let f = normalize(spec.functions['deprecate'].decode(item.transaction.input))
                ctx.store.UsdtFunctionDeprecate.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'deprecate',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    upgradedAddress: f[0],
                })
                break
            }
            case spec.functions['approve'].sighash: {
                let f = normalize(spec.functions['approve'].decode(item.transaction.input))
                ctx.store.UsdtFunctionApprove.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'approve',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    spender: f[0],
                    value: f[1],
                })
                break
            }
            case spec.functions['addBlackList'].sighash: {
                let f = normalize(spec.functions['addBlackList'].decode(item.transaction.input))
                ctx.store.UsdtFunctionAddBlackList.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'addBlackList',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    evilUser: f[0],
                })
                break
            }
            case spec.functions['transferFrom'].sighash: {
                let f = normalize(spec.functions['transferFrom'].decode(item.transaction.input))
                ctx.store.UsdtFunctionTransferFrom.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'transferFrom',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    from: f[0],
                    to: f[1],
                    value: f[2],
                })
                break
            }
            case spec.functions['unpause'].sighash: {
                let f = normalize(spec.functions['unpause'].decode(item.transaction.input))
                ctx.store.UsdtFunctionUnpause.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'unpause',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                })
                break
            }
            case spec.functions['pause'].sighash: {
                let f = normalize(spec.functions['pause'].decode(item.transaction.input))
                ctx.store.UsdtFunctionPause.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'pause',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                })
                break
            }
            case spec.functions['transfer'].sighash: {
                let f = normalize(spec.functions['transfer'].decode(item.transaction.input))
                ctx.store.UsdtFunctionTransfer.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'transfer',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    to: f[0],
                    value: f[1],
                })
                break
            }
            case spec.functions['setParams'].sighash: {
                let f = normalize(spec.functions['setParams'].decode(item.transaction.input))
                ctx.store.UsdtFunctionSetParams.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'setParams',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    newBasisPoints: f[0],
                    newMaxFee: f[1],
                })
                break
            }
            case spec.functions['issue'].sighash: {
                let f = normalize(spec.functions['issue'].decode(item.transaction.input))
                ctx.store.UsdtFunctionIssue.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'issue',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    amount: f[0],
                })
                break
            }
            case spec.functions['redeem'].sighash: {
                let f = normalize(spec.functions['redeem'].decode(item.transaction.input))
                ctx.store.UsdtFunctionRedeem.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'redeem',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    amount: f[0],
                })
                break
            }
            case spec.functions['removeBlackList'].sighash: {
                let f = normalize(spec.functions['removeBlackList'].decode(item.transaction.input))
                ctx.store.UsdtFunctionRemoveBlackList.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'removeBlackList',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    clearedUser: f[0],
                })
                break
            }
            case spec.functions['transferOwnership'].sighash: {
                let f = normalize(spec.functions['transferOwnership'].decode(item.transaction.input))
                ctx.store.UsdtFunctionTransferOwnership.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'transferOwnership',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    newOwner: f[0],
                })
                break
            }
            case spec.functions['destroyBlackFunds'].sighash: {
                let f = normalize(spec.functions['destroyBlackFunds'].decode(item.transaction.input))
                ctx.store.UsdtFunctionDestroyBlackFunds.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'destroyBlackFunds',
                    functionValue: item.transaction.value,
                    functionSuccess: Boolean(item.transaction.status),
                    blackListedUser: f[0],
                })
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
