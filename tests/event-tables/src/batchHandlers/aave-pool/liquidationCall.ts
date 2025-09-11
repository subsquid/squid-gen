// liquidationCall.ts
// This module maps LiquidationCall event logs to
// any TypeORM model classes these logs might affect.

import {
  TokensTransfer,
  AavePoolLiquidationCall
} from '../../model'
import {
  ProcessorContext,
  DecodedLogWithContractMetadata
} from '../../config'
import {
  NetworkName
} from '../../types/config'

export async function handleLiquidationCalls(
  network: NetworkName,
  ctx: ProcessorContext,
  logs: DecodedLogWithContractMetadata[],
  previouslyProcessed: {
    transfers: TokensTransfer[]
  }
): Promise<{
  transfers: TokensTransfer[],
  liquidationCalls: AavePoolLiquidationCall[]
}> {

  const liquidationCalls = logs.map(l => new AavePoolLiquidationCall({
    id: l.id,
    network,
    instanceAddress: l.contract.instanceAddress,
    block: l.block.height,
    txnHash: l.transactionHash,
    collateralAsset: l.decoded.collateralAsset,
    debtAsset: l.decoded.debtAsset,
    user: l.decoded.user,
    debtToCover: l.decoded.debtToCover,
    liquidatedCollateralAmount: l.decoded.liquidatedCollateralAmount,
    liquidator: l.decoded.liquidator,
    receiveAToken: l.decoded.receiveAToken
  }))

  await ctx.store.insert(liquidationCalls)

  return {
    transfers: previouslyProcessed.transfers,
    liquidationCalls
  }
}
