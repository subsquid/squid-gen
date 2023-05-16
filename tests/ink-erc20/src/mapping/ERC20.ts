import {SubstrateBlock, ContractsContractEmittedEvent} from '@subsquid/substrate-processor'
import {EntityBuffer} from '../entityBuffer'
import {Erc20EventTransfer, Erc20EventApproval} from '../model'
import * as spec from '../abi/ERC20'
import {fromss58, normalize} from '../util'

const ss58address = 'XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w'
export const { prefix, hexAddress: address } = fromss58(ss58address)

export function parse(block: SubstrateBlock, event: ContractsContractEmittedEvent) {
    let e = normalize(spec.decodeEvent(event.args.data))
    switch (e.__kind) {
        case 'Transfer': {
            EntityBuffer.add(
                new Erc20EventTransfer({
                    id: event.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    extrinsicHash: event.extrinsic.hash,
                    contract: event.args.contract,
                    eventName: 'Transfer',
                    from: e.from,
                    to: e.to,
                    value: e.value,
                })
            )
            break
        }
        case 'Approval': {
            EntityBuffer.add(
                new Erc20EventApproval({
                    id: event.id,
                    blockNumber: block.height,
                    blockTimestamp: new Date(block.timestamp),
                    extrinsicHash: event.extrinsic.hash,
                    contract: event.args.contract,
                    eventName: 'Approval',
                    owner: e.owner,
                    spender: e.spender,
                    value: e.value,
                })
            )
            break
        }
    }
}

