import {
  FieldSelection,
  BlockHeader as _BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
  Trace as _Trace,
  StateDiff as _StateDiff,
  DataHandlerContext
} from '@subsquid/evm-processor'

import {Store as TypeormStore} from '@subsquid/typeorm-store'

import {
  NetworkConfig as _NetworkConfig,
  FullConfig as _FullConfig,
  ContractConfig as _ContractConfig,
  EventConfig as _EventConfig
} from  './types/config'

import {
  DecodedLogWithContractMetadata as _DecodedLogWithContractMetadata
} from './types/extendedData'

import * as erc20Abi from './abi/erc20'
import * as aavePoolAbi from './abi/aave-pool'

import { handleTransfers } from './batchHandlers/tokens/transfer'
import { handleLiquidationCalls } from './batchHandlers/aave-pool/liquidationCall'

// Can vary by network/processor, but we'll use a single global value here.
export const fieldSelection = {
  log: {
    address: true,
    data: true,
    topics: true,
    transactionHash: true
  }
} as const // Without "as const" downstream types will break.
// Temporarily designate "as FieldSelection" to gain IDE field suggestions.

/***** types for use in handlers *****/

export type BlockHeader = _BlockHeader<typeof fieldSelection>
export type Log = _Log<typeof fieldSelection>
export type Transaction = _Transaction<typeof fieldSelection>
export type Trace = _Trace<typeof fieldSelection>
export type StateDiff = _StateDiff<typeof fieldSelection>
export type ProcessorContext = DataHandlerContext<TypeormStore, typeof fieldSelection>

export type NetworkConfig = _NetworkConfig<TypeormStore, typeof fieldSelection>
export type FullConfig = _FullConfig<TypeormStore, typeof fieldSelection>
export type ContractConfig = _ContractConfig<TypeormStore, typeof fieldSelection>
export type EventConfig = _EventConfig<TypeormStore, typeof fieldSelection>

export type DecodedLogWithContractMetadata = _DecodedLogWithContractMetadata<typeof fieldSelection>

/***** types for use in handlers - end *****/

export const config: FullConfig = {
  'ethereum-mainnet': {
    gateway: 'https://v2.archive.subsquid.io/network/ethereum-mainnet',
    rpcEndpoint: process.env.RPC_ETH_HTTP,
    finalityConfirmation: 75,
    // order of requests matters - handler execution will follow it
    requests: [
      {
        contract: 'Tokens',
        addresses: {
          'usdc': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'.toLowerCase()
        },
        events: [
          {
            name: 'Transfer',
            abiHelper: erc20Abi.events.Transfer,
            batchHandler: handleTransfers
          }
        ],
        range: {
          from: 6082465
        }
      },
      {
        contract: 'AavePool',
        addresses: {
          'main': '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'.toLowerCase()
        },
        events: [
          {
            name: 'LiquidationCall',
            abiHelper: aavePoolAbi.events.LiquidationCall,
            batchHandler: handleLiquidationCalls
          }
        ],
        range: {
          from: 11362579
        }
      }
    ]
  },
  'arbitrum-one': {
    gateway: 'https://v2.archive.subsquid.io/network/arbitrum-one',
    rpcEndpoint: process.env.RPC_ARBITRUM_ONE_HTTP,
    finalityConfirmation: 15,
    requests: [
      {
        contract: 'Tokens',
        addresses: {
          'sqd': '0x1337420dED5ADb9980CFc35f8f2B054ea86f8aB1'.toLocaleLowerCase()
        },
        events: [
          {
            name: 'Transfer',
            abiHelper: erc20Abi.events.Transfer,
            batchHandler: handleTransfers
          }
        ],
        range: {
          from: 194120655
        }
      }
    ]
  }
}