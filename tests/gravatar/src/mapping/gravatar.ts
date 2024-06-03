import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import {EntityBuffer} from '../entityBuffer'
import {GravatarEventNewGravatar, GravatarEventUpdatedGravatar, GravatarFunctionUpdateGravatarImage, GravatarFunctionSetMythicalGravatar, GravatarFunctionUpdateGravatarName, GravatarFunctionCreateGravatar} from '../model'
import * as spec from '../abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'
import {Log, Transaction} from '../processor'

const address = '0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['NewGravatar'].topic: {
                let e = spec.events['NewGravatar'].decode(log)
                EntityBuffer.add(
                    new GravatarEventNewGravatar({
                        id: log.id,
                        blockNumber: log.block.height,
                        blockTimestamp: new Date(log.block.timestamp),
                        transactionHash: log.transaction!.hash,
                        contract: log.address,
                        eventName: 'NewGravatar',
                        paramId: e.id,
                        owner: e.owner,
                        displayName: e.displayName,
                        imageUrl: e.imageUrl,
                    })
                )
                break
            }
            case spec.events['UpdatedGravatar'].topic: {
                let e = spec.events['UpdatedGravatar'].decode(log)
                EntityBuffer.add(
                    new GravatarEventUpdatedGravatar({
                        id: log.id,
                        blockNumber: log.block.height,
                        blockTimestamp: new Date(log.block.timestamp),
                        transactionHash: log.transaction!.hash,
                        contract: log.address,
                        eventName: 'UpdatedGravatar',
                        paramId: e.id,
                        owner: e.owner,
                        displayName: e.displayName,
                        imageUrl: e.imageUrl,
                    })
                )
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
            case spec.functions['updateGravatarImage'].sighash: {
                let f = spec.functions['updateGravatarImage'].decode(transaction.input)
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
                break
            }
            case spec.functions['setMythicalGravatar'].sighash: {
                let f = spec.functions['setMythicalGravatar'].decode(transaction.input)
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
                break
            }
            case spec.functions['updateGravatarName'].sighash: {
                let f = spec.functions['updateGravatarName'].decode(transaction.input)
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
                break
            }
            case spec.functions['createGravatar'].sighash: {
                let f = spec.functions['createGravatar'].decode(transaction.input)
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
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
