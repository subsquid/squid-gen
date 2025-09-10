// liquidationCall.ts
// This module maps LiquidationCall event logs to
// any TypeORM model classes these logs might affect.

import {
  AavePoolMainLiquidationCall
} from '../../model'
import {
  ProcessorContext,
  DecodedLogWithContractMetadata
} from '../../config'
import {
  TokensTransfer
} from '../tokens/transfer'

export async function handleLiquidationCalls(
  ctx: ProcessorContext,
  logs: DecodedLogWithContractMetadata[],
  previouslyProcessed: {
    transfers: TokensTransfer[]
  }
): Promise<{
  transfers: TokensTransfer[],
  liquidationCalls: AavePoolMainLiquidationCall[]
}> {

  const liquidationCalls = logs.map(l => {
    let ContractClass
    switch (l.contract.instanceName) {
      case 'main':
        ContractClass = AavePoolMainLiquidationCall
        break
      default:
        throw new Error(`handleLiquidationCalls for a log from an unknown contract instance ${l.contract.instanceName}`)
    }

    return new ContractClass({
      id: l.id,
      block: l.block.height,
      txnHash: l.transactionHash,
      collateralAsset: l.decoded.collateralAsset,
      debtAsset: l.decoded.debtAsset,
      user: l.decoded.user,
      debtToCover: l.decoded.debtToCover,
      liquidatedCollateralAmount: l.decoded.liquidatedCollateralAmount,
      liquidator: l.decoded.liquidator,
      receiveAToken: l.decoded.receiveAToken
    })
  })

  await ctx.store.insert(liquidationCalls)

  return {
    transfers: previouslyProcessed.transfers,
    liquidationCalls
  }
}
