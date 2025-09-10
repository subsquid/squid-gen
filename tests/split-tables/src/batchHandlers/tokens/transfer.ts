// transfer.ts
// This module maps Transfer event logs to
// any TypeORM model classes these logs might affect.

import {
  TokensUsdcTransfer,
  TokensSqdTransfer
} from '../../model'
import {
  ProcessorContext,
  DecodedLogWithContractMetadata
} from '../../config'

export type TokensTransfer = TokensUsdcTransfer | TokensSqdTransfer

export async function handleTransfers(
  ctx: ProcessorContext,
  logs: DecodedLogWithContractMetadata[],
  previouslyProcessed: {}
): Promise<{
  transfers: TokensTransfer[]
}> {

  const transfers = logs.map(l => {
    let ContractClass
    switch (l.contract.instanceName) {
      case 'usdc':
        ContractClass = TokensUsdcTransfer
        break
      case 'sqd':
        ContractClass = TokensSqdTransfer
        break
      default:
        throw new Error(`handleTransfers for a log from an unknown contract instance ${l.contract.instanceName}`)
    }

    return new ContractClass({
      id: l.id,
      block: l.block.height,
      txnHash: l.transactionHash,
      from: l.decoded.from,
      to: l.decoded.to,
      value: l.decoded.value
    })
  })

  await ctx.store.insert(transfers)

  return { transfers }
}