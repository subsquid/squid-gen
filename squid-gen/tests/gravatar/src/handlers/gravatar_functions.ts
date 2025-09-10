import type {DataHandlerContext} from '@subsquid/evm-processor'
import type {Store} from '../db'
import {functions} from '../abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'
import {EntityBuffer} from '../entityBuffer'
import {GravatarFunctionUpdateGravatarImage, GravatarFunctionSetMythicalGravatar, GravatarFunctionUpdateGravatarName, GravatarFunctionCreateGravatar} from '../model'
import {Transaction} from '../processor'

export function handleUpdateGravatarImageFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['updateGravatarImage'].decode(transaction)
    EntityBuffer.add(
        new GravatarFunctionUpdateGravatarImage({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'updateGravatarImage',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            imageUrl: f._imageUrl,
        })
    )
}
export function handleSetMythicalGravatarFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['setMythicalGravatar'].decode(transaction)
    EntityBuffer.add(
        new GravatarFunctionSetMythicalGravatar({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'setMythicalGravatar',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
        })
    )
}
export function handleUpdateGravatarNameFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['updateGravatarName'].decode(transaction)
    EntityBuffer.add(
        new GravatarFunctionUpdateGravatarName({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'updateGravatarName',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            displayName: f._displayName,
        })
    )
}
export function handleCreateGravatarFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    const f = functions['createGravatar'].decode(transaction)
    EntityBuffer.add(
        new GravatarFunctionCreateGravatar({
            id: transaction.id,
            blockNumber: transaction.block.height,
            blockTimestamp: new Date(transaction.block.timestamp),
            transactionHash: transaction!.hash,
            contract: transaction.to!,
            functionName: 'createGravatar',
            functionValue: transaction.value,
            functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
            displayName: f._displayName,
            imageUrl: f._imageUrl,
        })
    )
}
