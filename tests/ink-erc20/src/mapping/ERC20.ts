import {SubstrateBlock, ContractsContractEmittedEvent} from '@subsquid/substrate-processor'
import {EntityBuffer} from '../entityBuffer'
import {Erc20EventTransfer, Erc20EventApproval} from '../model'
import * as spec from '../abi/ERC20'
import {normalize} from '../util'

export const address = '0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72'

export function parse(block: SubstrateBlock, event: ContractsContractEmittedEvent) {
    let e = normalize(spec.decodeEvent(event.args.data))
    switch (e.__kind) {
        case 'Transfer': {
            EntityBuffer.add(
                new Erc20EventTransfer({
                    id: event.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    contract: event.args.contract,
                    eventName: 'Transfer',
                    from: e.from,
                    to: e.to,
                    value: e.value,
                })
            )
        }
        case 'Approval': {
            EntityBuffer.add(
                new Erc20EventApproval({
                    id: event.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    contract: event.args.contract,
                    eventName: 'Approval',
                    owner: e.owner,
                    spender: e.spender,
                    value: e.value,
                })
            )
        }
    }
}

