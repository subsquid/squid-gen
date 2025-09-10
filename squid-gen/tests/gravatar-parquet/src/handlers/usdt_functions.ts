import type {DataHandlerContext} from '@subsquid/evm-processor'
import type {Store} from '../db'
import {functions} from '../abi/0xdac17f958d2ee523a2206206994597c13d831ec7'
import {Transaction} from '../processor'

export function handleDeprecateFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['deprecate'].decode(transaction)
    ctx.store.UsdtFunctionDeprecate.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'deprecate',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        upgradedAddress: f._upgradedAddress,
    })
}
export function handleApproveFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['approve'].decode(transaction)
    ctx.store.UsdtFunctionApprove.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'approve',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        spender: f._spender,
        value: f._value,
    })
}
export function handleAddBlackListFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['addBlackList'].decode(transaction)
    ctx.store.UsdtFunctionAddBlackList.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'addBlackList',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        evilUser: f._evilUser,
    })
}
export function handleTransferFromFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['transferFrom'].decode(transaction)
    ctx.store.UsdtFunctionTransferFrom.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'transferFrom',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        from: f._from,
        to: f._to,
        value: f._value,
    })
}
export function handleUnpauseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['unpause'].decode(transaction)
    ctx.store.UsdtFunctionUnpause.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'unpause',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
    })
}
export function handlePauseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['pause'].decode(transaction)
    ctx.store.UsdtFunctionPause.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'pause',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
    })
}
export function handleTransferFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['transfer'].decode(transaction)
    ctx.store.UsdtFunctionTransfer.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'transfer',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        to: f._to,
        value: f._value,
    })
}
export function handleSetParamsFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setParams'].decode(transaction)
    ctx.store.UsdtFunctionSetParams.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'setParams',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        newBasisPoints: f.newBasisPoints,
        newMaxFee: f.newMaxFee,
    })
}
export function handleIssueFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['issue'].decode(transaction)
    ctx.store.UsdtFunctionIssue.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'issue',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        amount: f.amount,
    })
}
export function handleRedeemFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['redeem'].decode(transaction)
    ctx.store.UsdtFunctionRedeem.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'redeem',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        amount: f.amount,
    })
}
export function handleRemoveBlackListFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['removeBlackList'].decode(transaction)
    ctx.store.UsdtFunctionRemoveBlackList.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'removeBlackList',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        clearedUser: f._clearedUser,
    })
}
export function handleTransferOwnershipFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['transferOwnership'].decode(transaction)
    ctx.store.UsdtFunctionTransferOwnership.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'transferOwnership',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        newOwner: f.newOwner,
    })
}
export function handleDestroyBlackFundsFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['destroyBlackFunds'].decode(transaction)
    ctx.store.UsdtFunctionDestroyBlackFunds.write({
        id: transaction.id,
        blockNumber: transaction.block.height,
        blockTimestamp: new Date(transaction.block.timestamp),
        transactionHash: transaction!.hash,
        contract: transaction.to!,
        functionName: 'destroyBlackFunds',
        functionValue: transaction.value,
        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        blackListedUser: f._blackListedUser,
    })
}
