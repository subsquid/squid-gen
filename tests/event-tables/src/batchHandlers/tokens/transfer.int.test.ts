import { Store } from '@subsquid/typeorm-store'
import { setupTestDatabase, type TestDatabase } from '../../testing/testDatabase'
import { createDefaultLog } from '../../testing/defaultObjects'

import { handleTransfers } from './transfer'

describe('handleTransfers integration', () => {
  let db: TestDatabase
  let store: Store

  beforeAll(async () => {
    db = await setupTestDatabase()
    store = new Store(() => db.dataSource.manager)
  })

  afterAll(async () => {
    await db.cleanup()
  })

  it('should process transfers and save them to the database', async () => {
    const decodedUsdcTestLog = {
      from: '0xfromusdc',
      to: '0xtousdc',
      value: BigInt(250)
    }
    const usdcTestLog = {
      contract: {
        name: 'Tokens',
        instanceName: 'usdc',
        instanceAddress: '0xusdc'
      },
      decoded: decodedUsdcTestLog,
      ...createDefaultLog()
    }
    usdcTestLog.id = 'myusdclogid'
    usdcTestLog.block.height = 77
    usdcTestLog.transactionHash = '0xmyusdctransactionhashfromlog'

    const decodedSqdTestLog = {
      from: '0xfromsqd',
      to: '0xtosqd',
      value: BigInt(520)
    }
    const sqdTestLog = {
      contract: {
        name: 'Tokens',
        instanceName: 'sqd',
        instanceAddress: '0xsqd'
      },
      decoded: decodedSqdTestLog,
      ...createDefaultLog()
    }
    sqdTestLog.id = 'mysqdlogid'
    sqdTestLog.block.height = 9900
    sqdTestLog.transactionHash = '0xmysqdtransactionhashfromlog'

    // Minimal ProcessorContext mock
    const ctx = { store } as any
    const { transfers } = await handleTransfers(
      'ethereum-mainnet',
      ctx,
      [usdcTestLog, sqdTestLog],
      {}
    )

    expect(transfers).toHaveLength(2)
    expect(transfers[0]).toMatchObject({
      id: 'myusdclogid',
      block: 77,
      ...decodedUsdcTestLog,
      txnHash: '0xmyusdctransactionhashfromlog',
    })
    expect(transfers[1]).toMatchObject({
      id: 'mysqdlogid',
      block: 9900,
      ...decodedSqdTestLog,
      txnHash: '0xmysqdtransactionhashfromlog',
    })

    const dbTransfers = await db.dataSource
      .createQueryBuilder()
      .select('*')
      .from('tokens_usdc_transfer', 't')
      .addOrderBy('block', 'ASC')
      .getRawMany()

    expect(dbTransfers).toHaveLength(2)
    expect(dbTransfers[0]).toMatchObject({
      id: 'myusdclogid',
      block: 77,
      txn_hash: '0xmyusdctransactionhashfromlog',
      from: decodedUsdcTestLog.from,
      to: decodedUsdcTestLog.to,
      value: decodedUsdcTestLog.value.toString()
    })
    expect(dbTransfers[1]).toMatchObject({
      id: 'mysqdlogid',
      block: 9900,
      txn_hash: '0xmysqdtransactionhashfromlog',
      from: decodedSqdTestLog.from,
      to: decodedSqdTestLog.to,
      value: decodedSqdTestLog.value.toString()
    })
  })

}) 
