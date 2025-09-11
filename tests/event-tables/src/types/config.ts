import { Log, FieldSelection, DataHandlerContext } from '@subsquid/evm-processor'
import { DecodedLogWithContractMetadata } from './extendedData'

export type NetworkName = 'ethereum-mainnet' | 'arbitrum-one'
export type ContractName = 'Tokens' | 'AavePool'

export interface EventConfig<TStore, F extends FieldSelection> {
  name: string,
  abiHelper: {
    topic: string
    is: (event: Log<F>) => boolean
    decode: (event: Log<F>) => {[field: string]: any}
  },
  batchHandler: (
    network: NetworkName,
    ctx: DataHandlerContext<TStore,F>,
    logs: DecodedLogWithContractMetadata<F>[],
    previouslyProcessed: any
  ) => Promise<any>
}
  
export interface ContractConfig<TStore, F extends FieldSelection> {
  contract: ContractName
  addresses: {
    [addressAlias: string]: string
  }
  events: EventConfig<TStore, F>[]
  range: {
    from: number
  }
}

export interface NetworkConfig<TStore, F extends FieldSelection> {
  gateway: string
  rpcEndpoint: string | undefined
  finalityConfirmation: number
  requests: ContractConfig<TStore, F>[]
}
  
export interface FullConfig<TStore, F extends FieldSelection> {
  [networkName: string]: NetworkConfig<TStore, F>
}