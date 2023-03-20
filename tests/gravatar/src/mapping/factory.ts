import {CommonHandlerContext, EvmBlock} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import {Store} from '../db'
import {EntityBuffer} from '../entityBuffer'
import {FactoryEventNewGravatar, FactoryEventUpdatedGravatar, FactoryFunctionUpdateGravatarImage, FactoryFunctionSetMythicalGravatar, FactoryFunctionUpdateGravatarName, FactoryFunctionCreateGravatar} from '../model'
import * as spec from '../abi/0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'
import {normalize} from '../util'

export {spec}

export const address = '0x2e645469f354bb4f5c8a05b3b30a929361cf77ec'

type EventItem = LogItem<{evmLog: {topics: true, data: true}, transaction: {hash: true}}>
type FunctionItem = TransactionItem<{transaction: {hash: true, input: true, value: true}}>

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
            case spec.events['NewGravatar'].topic: {
                let e = normalize(spec.events['NewGravatar'].decode(item.evmLog))
                EntityBuffer.add(
                    new FactoryEventNewGravatar({
                        id0: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'NewGravatar',
                        id1: e[0],
                        owner0: e[1],
                        displayName0: e[2],
                        imageUrl0: e[3],
                        id2: e[4],
                        owner1: e[5],
                        displayName1: e[6],
                        imageUrl1: e[7],
                    })
                )
            }
            case spec.events['UpdatedGravatar'].topic: {
                let e = normalize(spec.events['UpdatedGravatar'].decode(item.evmLog))
                EntityBuffer.add(
                    new FactoryEventUpdatedGravatar({
                        id0: item.evmLog.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        eventName: 'UpdatedGravatar',
                        id1: e[0],
                        owner0: e[1],
                        displayName0: e[2],
                        imageUrl0: e[3],
                        id2: e[4],
                        owner1: e[5],
                        displayName1: e[6],
                        imageUrl1: e[7],
                    })
                )
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode event "${item.evmLog.topics[0]}"`)
    }
}

function parseFunction(ctx: CommonHandlerContext<unknown>, block: EvmBlock, item: FunctionItem) {
    try {
        switch (item.transaction.input.slice(0, 10)) {
            case spec.functions['updateGravatarImage'].sighash: {
                let f = normalize(spec.functions['updateGravatarImage'].decode(item.transaction.input))
                EntityBuffer.add(
                    new FactoryFunctionUpdateGravatarImage({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'updateGravatarImage',
                        functionValue: item.transaction.value,
                        functionSuccess: f[0],
                        imageUrl0: f[1],
                        owner: f[2],
                        param00: f[3],
                        param01: f[4],
                        displayName0: f[5],
                        displayName1: f[6],
                        imageUrl1: f[7],
                        param02: f[8],
                    })
                )
            }
            case spec.functions['setMythicalGravatar'].sighash: {
                let f = normalize(spec.functions['setMythicalGravatar'].decode(item.transaction.input))
                EntityBuffer.add(
                    new FactoryFunctionSetMythicalGravatar({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'setMythicalGravatar',
                        functionValue: item.transaction.value,
                        functionSuccess: f[0],
                        imageUrl0: f[1],
                        owner: f[2],
                        param00: f[3],
                        param01: f[4],
                        displayName0: f[5],
                        displayName1: f[6],
                        imageUrl1: f[7],
                        param02: f[8],
                    })
                )
            }
            case spec.functions['updateGravatarName'].sighash: {
                let f = normalize(spec.functions['updateGravatarName'].decode(item.transaction.input))
                EntityBuffer.add(
                    new FactoryFunctionUpdateGravatarName({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'updateGravatarName',
                        functionValue: item.transaction.value,
                        functionSuccess: f[0],
                        imageUrl0: f[1],
                        owner: f[2],
                        param00: f[3],
                        param01: f[4],
                        displayName0: f[5],
                        displayName1: f[6],
                        imageUrl1: f[7],
                        param02: f[8],
                    })
                )
            }
            case spec.functions['createGravatar'].sighash: {
                let f = normalize(spec.functions['createGravatar'].decode(item.transaction.input))
                EntityBuffer.add(
                    new FactoryFunctionCreateGravatar({
                        id: item.transaction.id,
                        blockNumber: block.height,
                        blockTimestamp: new Date(block.timestamp),
                        transactionHash: item.transaction.hash,
                        contract: item.address,
                        functionName: 'createGravatar',
                        functionValue: item.transaction.value,
                        functionSuccess: f[0],
                        imageUrl0: f[1],
                        owner: f[2],
                        param00: f[3],
                        param01: f[4],
                        displayName0: f[5],
                        displayName1: f[6],
                        imageUrl1: f[7],
                        param02: f[8],
                    })
                )
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
