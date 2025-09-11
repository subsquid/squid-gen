// transfer.ts
// This module maps Transfer event logs to
// any TypeORM model classes these logs might affect.

import {
  TokensTransfer
} from '../../model'
import {
  ProcessorContext,
  DecodedLogWithContractMetadata
} from '../../config'
import {
  NetworkName
} from '../../types/config'

export async function handleTransfers(
  network: NetworkName,
  ctx: ProcessorContext,
  logs: DecodedLogWithContractMetadata[],
  previouslyProcessed: {}
): Promise<{
  transfers: TokensTransfer[]
}> {

  const transfers = logs.map(l => new TokensTransfer({
    id: l.id,
    network,
    instanceAddress: l.contract.instanceAddress,
    block: l.block.height,
    txnHash: l.transactionHash,
    from: l.decoded.from,
    to: l.decoded.to,
    value: l.decoded.value
  }))

  await ctx.store.insert(transfers)

  return { transfers }
}