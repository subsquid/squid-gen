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

  it('should process a usdc transfer and save it to the database', async () => {
    const decodedTestLog = {
      from: '0xfromusdc',
      to: '0xtousdc',
      value: BigInt(250)
    }
    const testLog = {
      contract: {
        name: 'Tokens',
        instanceName: 'usdc',
        instanceAddress: '0xusdc'
      },
      decoded: decodedTestLog,
      ...createDefaultLog()
    }
    testLog.id = 'myusdclogid'
    testLog.block.height = 77
    testLog.transactionHash = '0xmyusdctransactionhashfromlog'

    // Minimal ProcessorContext mock
    const ctx = { store } as any
    const { transfers } = await handleTransfers(ctx, [testLog], {})

    expect(transfers).toHaveLength(1)
    expect(transfers[0]).toMatchObject({
      id: 'myusdclogid',
      block: 77,
      ...decodedTestLog,
      txnHash: '0xmyusdctransactionhashfromlog',
    })

    const dbTransfers = await db.dataSource
      .createQueryBuilder()
      .select('*')
      .from('tokens_usdc_transfer', 't')
      .getRawMany()

    expect(dbTransfers).toHaveLength(1)
    expect(dbTransfers[0]).toMatchObject({
      id: 'myusdclogid',
      block: 77,
      txn_hash: '0xmyusdctransactionhashfromlog',
      from: decodedTestLog.from,
      to: decodedTestLog.to,
      value: decodedTestLog.value.toString()
    })
  })
}) 
