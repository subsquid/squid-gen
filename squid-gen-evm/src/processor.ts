import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidArchive, SquidChainRpc, SquidContract} from './interfaces'
import path from 'path'
import {resolveModule} from '@subsquid/squid-gen-utils'

export class ProcessorCodegen {
    private out: FileOutput

    private abi = new Set<string>()
    private archiveRegistry = false

    constructor(
        private outDir: OutDir,
        private options: {
            archive: SquidArchive
            chain?: SquidChainRpc
            contracts: SquidContract[]
            finalityConfirmation?: number
        }
    ) {
        this.out = this.outDir.file(`processor.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        this.out.line(`export const processor = new EvmBatchProcessor()`)
        this.out.indentation(() => {
            this.printDoc('Datalake with historical data for the network', 'https://docs.subsquid.io/subsquid-network/reference/evm-networks/')
            this.out.line(`.setGateway('${this.options.archive.value}')`)
            this.printDoc('RPC endpoint to fetch latest blocks.\nSet RPC_URL environment variable, or specify ChainRpc endpoint', 'https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-rpc-endpoint')
            this.out.line(`.setRpcEndpoint(process.env.RPC_URL)`)
            this.out.line()
            this.printDoc('Specify which type of data needs to be extracted from the block', 'https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields')
            this.out.line(`.setFields({`)
            this.out.indentation(() => {
                this.out.indentation(() => {
                    this.out.line(`log: {`)
                    this.out.indentation(() => {
                        this.out.line(`topics: true,`)
                        this.out.line(`data: true,`)
                        this.out.line(`transactionHash: true,`)
                    })
                    this.out.line(`},`)
                    this.out.line(`transaction: {`)
                    this.out.indentation(() => {
                        this.out.line(`hash: true,`)
                        this.out.line(`input: true,`)
                        this.out.line(`from: true,`)
                        this.out.line(`value: true,`)
                        this.out.line(`status: true,`)
                    })
                })
                this.out.line(`}`)
            })
            this.out.line(`})`)
            this.printSubscribes()
            if (this.options.finalityConfirmation != null) {
                this.out.line(`.setFinalityConfirmation(${this.options.finalityConfirmation})`)
            } else {
                this.printDoc('Uncomment this to specify the number of blocks after which the processor will consider the consensus data final', 'https://docs.subsquid.io/sdk/reference/processors/evm-batch/general/#set-finality-confirmation')
                this.out.line(`// .setFinalityConfirmation(1000)`)
            }
            this.out.line()
            this.out.line()
        })
        this.out.line(`export type Fields = EvmBatchProcessorFields<typeof processor>`)
        this.out.line(`export type Block = BlockHeader<Fields>`)
        this.out.line(`export type Log = _Log<Fields>`)
        this.out.line(`export type Transaction = _Transaction<Fields>`)

        return this.out.write()
    }

    private printDoc(text: string, link?: string) {
        text.split('\n').filter(l => l.trim().length > 0).forEach(line => {
            this.out.line(`/// ${line}`)
        });
        if (link) this.out.line(`/// @link ${link}`)
    }

    private printImports() {
        this.out.lazy(() => {
            this.out.line(
                `import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'`
            )
            if (this.archiveRegistry) {
                this.out.line(`import {lookupArchive} from '@subsquid/archive-registry'`)
            }
            for (let contract of this.options.contracts) {
                this.out.line(
                    `import * as ${contract.name}Abi from '${resolveModule(
                        this.out.file,
                        path.resolve(`src`, `abi`, contract.spec)
                    )}'`
                )
            }
        })
    }

    private printChain() {
        if (!this.options.chain) {
            return
        }

        if (typeof this.options.chain === 'string') {
            this.out.line(`chain: '${this.options.chain}',`)
            return
        }

        this.out.line(`chain: {`)
        this.out.indentation(() => {
            if (!this.options.chain) {
                return
            }

            if (typeof this.options.chain === 'string') {
                this.out.line(`url: '${this.options.chain}',`)
                return
            }

            this.out.line(`url: '${this.options.chain.url}',`)
            if (this.options.chain.capacity != null) {
                this.out.line(`capacity: ${this.options.chain.capacity},`)
            }
            if (this.options.chain.rateLimit != null) {
                this.out.line(`rateLimit: ${this.options.chain.rateLimit},`)
            }
            if (this.options.chain.requestTimeout != null) {
                this.out.line(`requestTimeout: ${this.options.chain.requestTimeout},`)
            }
            if (this.options.chain.maxBatchCallSize != null) {
                this.out.line(`maxBatchCallSize: ${this.options.chain.maxBatchCallSize},`)
            }
        })
        this.out.line(`},`)
    }

    private printSubscribes() {
        for (let contract of this.options.contracts) {
            if (Object.keys(contract.events).length > 0) {
                this.printDoc(`Subscribe to events emitted by ${contract.name}`)
                this.out.line(`.addLog({`)
                this.out.indentation(() => {
                    this.printDoc(`${contract.name} address`)
                    this.out.line(`address: ['${contract.address}'],`)
                    this.printDoc('Topic0 of subscribed events', 'https://docs.subsquid.io/sdk/reference/processors/evm-batch/field-selection/#set-fields')
                    this.out.line(`topic0: [`)
                    this.out.indentation(() => {
                        for (let e in contract.events) {
                            this.out.line(`${contract.name}Abi.events['${contract.events[e].abiName}'].topic,`)
                        }
                    })
                    this.out.line(`],`)
                    if (contract.range != null && (contract.range.from != null || contract.range.to != null)) {
                        this.printDoc('Scanned blocks range')
                        let range = contract.range
                        this.out.line(`range: {`)
                        this.out.indentation(() => {
                            this.out.line(`from: ${range.from ?? 0},`)
                            if (range.to) {
                                this.out.line(`to: ${range.to},`)
                            }
                        })
                        this.out.line(`},`)
                    }
                })
                this.out.line(`})`)
            }
            if (Object.keys(contract.functions).length > 0) {
                this.printDoc(`Subscribe to transactions to the contract`)
                this.out.line(`.addTransaction({`)
                this.out.indentation(() => {
                    this.printDoc(`${contract.name} address`)
                    this.out.line(`to: ['${contract.address}'],`)
                    this.printDoc('Selectors of subscribed methods', 'https://docs.soliditylang.org/en/latest/abi-spec.html#function-selector')
                    this.out.line(`sighash: [`)
                    this.out.indentation(() => {
                        for (let f in contract.functions) {
                            this.out.line(`${contract.name}Abi.functions['${contract.functions[f].abiName}'].sighash,`)
                        }
                    })
                    this.out.line(`],`)
                    if (contract.range != null && (contract.range.from != null || contract.range.to != null)) {
                        this.printDoc('Scanned blocks range')
                        let range = contract.range
                        this.out.line(`range: {`)
                        this.out.indentation(() => {
                            this.out.line(`from: ${range.from ?? 0},`)
                            if (range.to != null) {
                                this.out.line(`to: ${range.to},`)
                            }
                        })
                        this.out.line(`},`)
                    }
                })
                this.out.line(`})`)
            }
        }
    }

    private useArchiveRegistry() {
        this.archiveRegistry = true
    }
}
