import {CommonHandlerContext, EvmBlock} from '@subsquid/evm-processor'
import {LogItem, TransactionItem} from '@subsquid/evm-processor/lib/interfaces/dataSelection'
import {Store} from '../db'
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
                ctx.store.GravatarEventNewGravatar.write({
                    id: item.evmLog.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    eventName: 'NewGravatar',
                    id0: e[0],
                    owner: e[1],
                    displayName: e[2],
                    imageUrl: e[3],
                })
            }
            case spec.events['UpdatedGravatar'].topic: {
                let e = normalize(spec.events['UpdatedGravatar'].decode(item.evmLog))
                ctx.store.GravatarEventUpdatedGravatar.write({
                    id: item.evmLog.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    eventName: 'UpdatedGravatar',
                    id0: e[0],
                    owner: e[1],
                    displayName: e[2],
                    imageUrl: e[3],
                })
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
                ctx.store.GravatarFunctionUpdateGravatarImage.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'updateGravatarImage',
                    functionValue: item.transaction.value,
                    functionSuccess: f[0],
                    imageUrl: f[1],
                })
            }
            case spec.functions['setMythicalGravatar'].sighash: {
                let f = normalize(spec.functions['setMythicalGravatar'].decode(item.transaction.input))
                ctx.store.GravatarFunctionSetMythicalGravatar.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'setMythicalGravatar',
                    functionValue: item.transaction.value,
                    functionSuccess: f[0],
                })
            }
            case spec.functions['updateGravatarName'].sighash: {
                let f = normalize(spec.functions['updateGravatarName'].decode(item.transaction.input))
                ctx.store.GravatarFunctionUpdateGravatarName.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'updateGravatarName',
                    functionValue: item.transaction.value,
                    functionSuccess: f[0],
                    displayName: f[1],
                })
            }
            case spec.functions['createGravatar'].sighash: {
                let f = normalize(spec.functions['createGravatar'].decode(item.transaction.input))
                ctx.store.GravatarFunctionCreateGravatar.write({
                    id: item.transaction.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    transactionHash: item.transaction.hash,
                    contract: item.address,
                    functionName: 'createGravatar',
                    functionValue: item.transaction.value,
                    functionSuccess: f[0],
                    displayName: f[1],
                    imageUrl: f[2],
                })
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: block.height, blockHash: block.hash, address}, `Unable to decode function "${item.transaction.input.slice(0, 10)}"`)
    }
}
