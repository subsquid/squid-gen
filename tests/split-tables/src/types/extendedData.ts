import { Log, FieldSelection } from '@subsquid/evm-processor'

export type DecodedLogWithContractMetadata<F extends FieldSelection> = {
  decoded: {
    [k: string]: any
  },
  contract: {
    name: string,
    instanceName: string,
    instanceAddress: string
  }
} & Log<F>