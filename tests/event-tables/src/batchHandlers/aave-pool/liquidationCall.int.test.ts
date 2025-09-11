import { Store } from '@subsquid/typeorm-store'
import { setupTestDatabase, type TestDatabase } from '../../testing/testDatabase'
import { createDefaultLog } from '../../testing/defaultObjects'

import { handleLiquidationCalls } from './liquidationCall'

describe('handleLiquidationCalls integration', () => {
  let db: TestDatabase
  let store: Store

  beforeAll(async () => {
    db = await setupTestDatabase()
    store = new Store(() => db.dataSource.manager)
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it('should process liquidation calls and save them to the database', async () => {
    const decodedMainTestLog = {
      collateralAsset: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
      debtAsset: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      user: '0x1234567890123456789012345678901234567890',
      debtToCover: BigInt(1000000000), // 1000 USDC (6 decimals)
      liquidatedCollateralAmount: BigInt(2000000000000000000000), // 2000 DAI (18 decimals)
      liquidator: '0x9876543210987654321098765432109876543210',
      receiveAToken: true
    }
    const mainTestLog = {
      contract: {
        name: 'AavePool',
        instanceName: 'main',
        instanceAddress: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'
      },
      decoded: decodedMainTestLog,
      ...createDefaultLog()
    }
    mainTestLog.id = 'myliquidationcalllogid'
    mainTestLog.block.height = 11362580
    mainTestLog.transactionHash = '0xmyliquidationcalltransactionhash'

    // Minimal ProcessorContext mock
    const ctx = { store } as any
    const { liquidationCalls } = await handleLiquidationCalls(
      'ethereum-mainnet',
      ctx,
      [mainTestLog],
      { transfers: [] }
    )

    expect(liquidationCalls).toHaveLength(1)
    expect(liquidationCalls[0]).toMatchObject({
      id: 'myliquidationcalllogid',
      block: 11362580,
      ...decodedMainTestLog,
      txnHash: '0xmyliquidationcalltransactionhash',
    })

    const dbLiquidationCalls = await db.dataSource
      .createQueryBuilder()
      .select('*')
      .from('aave_pool_main_liquidation_call', 'l')
      .getRawMany()

    expect(dbLiquidationCalls).toHaveLength(1)
    expect(dbLiquidationCalls[0]).toMatchObject({
      id: 'myliquidationcalllogid',
      block: 11362580,
      txn_hash: '0xmyliquidationcalltransactionhash',
      collateral_asset: decodedMainTestLog.collateralAsset,
      debt_asset: decodedMainTestLog.debtAsset,
      user: decodedMainTestLog.user,
      debt_to_cover: decodedMainTestLog.debtToCover.toString(),
      liquidated_collateral_amount: decodedMainTestLog.liquidatedCollateralAmount.toString(),
      liquidator: decodedMainTestLog.liquidator,
      receive_a_token: decodedMainTestLog.receiveAToken
    })
  })
})
