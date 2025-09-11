// processor.ts
// Definition of the processor object. The configuration varies by chain, so
// we're wrapping it into a createProcessor() function.

// EvmBatchProcessor is the class responsible for data retrieval and processing.
import {
//  BlockHeader,
//  DataHandlerContext,
  EvmBatchProcessor,
} from '@subsquid/evm-processor'

import {
  fieldSelection,
  type NetworkConfig
} from './config'

// First we configure data retrieval.
export function createProcessor({
  gateway,
  rpcEndpoint,
  finalityConfirmation,
  requests
}: NetworkConfig): EvmBatchProcessor {
  const processor = new EvmBatchProcessor()
    // SQD Network gateways are the primary source of blockchain data in
    // squids, providing pre-filtered data in chunks of roughly 1-10k blocks.
    // Set this for a fast sync.
    .setGateway(gateway)
    // Another data source squid processors can use is chain RPC.
    // In this particular squid it is used to retrieve the very latest chain data
    // (including unfinalized blocks) in real time. It can also be used to
    //   - make direct RPC queries to get extra data during indexing
    //   - sync a squid without a gateway (slow)
    .setRpcEndpoint(rpcEndpoint)
    // The processor needs to know how many newest blocks it should mark as "hot".
    // If it detects a blockchain fork, it will roll back any changes to the
    // database made due to orphaned blocks, then re-run the processing for the
    // main chain blocks.
    .setFinalityConfirmation(finalityConfirmation)
    // .setFields() is for choosing data fields for all data items selected by
    // the .addXXX() methods
    .setFields(fieldSelection)

  for (let {addresses, events, range} of requests) {
    const cleanAddresses = Object.values(addresses)
    const eventTopics = events.map(e => e.abiHelper.topic)
    
    // .addXXX() methods request data items.
    //
    // We could have omitted the "address" filter to get events with matching
    // topic from all contracts network-wide, or the "topic0" filter to get
    // all events from the contracts in the cleanAddresses array, or both to
    // get all event logs chainwide. We also could have requested some related
    // data, such as parent transactions or their traces.
    //
    // Other .addXXX() methods (.addTransaction(), .addTrace(), .addStateDiff()
    // on EVM) are similarly feature-rich.
    processor.addLog({
      range, // also possible to .setBlockRange() processor-wide
      address: cleanAddresses,
      topic0: eventTopics
    })
  }

  return processor
}
