// main.ts
// This is the main executable of the squid indexer.

// Importing the factory that makes EvmBatchProcessor objects (main
// object of the app) out of network-specific configs.
import {
  createProcessor
} from './processor'

// Importing the class responsible for Postgres data storage.
// It is capable of handling the rollbacks that occur due to blockchain forks.
//
// There are also Database classes for storing data to files and BigQuery
// datasets.
import { TypeormDatabase } from '@subsquid/typeorm-store'

import {
  config as fullConfig,
  type DecodedLogWithContractMetadata,
  type ProcessorContext
} from './config'
import {
  NetworkName
} from './types/config'

const chain = Object.keys(fullConfig).find(k => k === process.argv[2])
if (!chain) {
  console.log(`The only argument of this squid's executable must be one of ${Object.keys(fullConfig)}, got ${process.argv[1]} instead`)
  process.exit(1)
}
const config = fullConfig[chain]

const processor = createProcessor(config)
const db = new TypeormDatabase({
  stateSchema: `${chain}_processor`,
  supportHotBlocks: true
})

interface SortedEventLogs {
  [contract: string]: {
    [event: string]: DecodedLogWithContractMetadata[]
  }
}

// The handler function that is executed once on each batch of data. Processor
// object provides the data via "ctx.blocks". However, the handler can contain
// arbitrary TypeScript code, so it's OK to bring in extra data from IPFS,
// direct RPC calls, external APIs etc.
processor.run(db, async (ctx: ProcessorContext) => {
  // Database IO is typically the most expensive operation
  // when writing to Postgres. The main idea behind the rest of
  // the processing code is to optimize for it by doing all
  // IO operations on batches.

  // An empty SortedEventLogs object that matches the shape of config's requests
  // We'll use it to store 
  const sortedEventLogs: SortedEventLogs = Object.fromEntries(
    config.requests.map(r => [
      r.contract,
      Object.fromEntries(
        r.events.map(e => [
          e.name,
          []
        ])
      )
    ])
  )

  // The data retrieved from the SQD Network gateway and/or the RPC endpoint
  // is supplied via ctx.blocks
  for (let block of ctx.blocks) {
    // On EVM, each block has four iterables:
    // logs, transactions, traces, stateDiffs.
    // We'll go through the logs, sorting and decoding them.
    for (let log of block.logs) {

      for (let {contract: contractName, addresses: instanceAddresses, events: eventRequests} of config.requests) {
        let contractInstance = Object.entries(instanceAddresses).find(a => a[1] === log.address)
        if (!contractInstance)
          continue

        let matchingEventRequest = eventRequests.find(e => e.abiHelper.is(log))
        if (!matchingEventRequest)
          continue

        let [
          contractInstanceName,
          contractInstanceAddress
        ] = contractInstance

        let decoded = matchingEventRequest.abiHelper.decode(log)

        sortedEventLogs[contractName][matchingEventRequest.name].push({
          contract: {
            name: contractName,
            instanceName: contractInstanceName,
            instanceAddress: contractInstanceAddress
          },
          decoded,
          ...log,
          block: block.header // doing this manually cause full augmentBlock() from @subsquid/solana-objects is sorta slow
        })
      }
    }
  }

  let processed: any = {}
  for (let {contract: contractName, events: eventRequests} of config.requests) {
    for (let {name: eventName, batchHandler} of eventRequests) {
      processed = await batchHandler(
        chain as NetworkName,
        ctx,
        sortedEventLogs[contractName][eventName],
        processed
      )
    }
  }
})
