import { Log, Transaction, BlockHeader } from '../config'

export const createDefaultBlockHeader: () => BlockHeader = () => ({
  id: 'defaultBlockId',
  hash: 'defaultBlockHash',
  parentHash: 'defaultParentBlockHash',
  timestamp: 111,
  height: 11
})

export const createDefaultTransaction: () => Transaction = () => ({
  id: 'defaultTransactionId',
  block: createDefaultBlockHeader(),
  transactionIndex: 22,
  hash: 'defaultTransactionHash',
  from: 'defaultTransactionFrom',
  to: 'defaultTransactionTo',
  logs: [],
  stateDiffs: [],
  traces: []
})

export const createDefaultLog: () => Log = () => ({
  id: 'defaultLogId',
  block: createDefaultBlockHeader(),
  transactionIndex: 33,
  logIndex: 333,
  address: 'defaultLogAddress',
  data: 'defaultLogData',
  getTransaction: () => createDefaultTransaction(),
  topics: [],
  transactionHash: 'defaultTransactionHashFromLog',
  transaction: undefined
})