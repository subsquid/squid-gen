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
            this.out.line(`.setDataSource({`)
            this.out.indentation(() => {
                if (this.options.archive.kind === 'name') {
                    this.useArchiveRegistry()
                    this.out.line(`archive: lookupArchive('${this.options.archive.value}', {type: 'EVM'}),`)
                } else {
                    this.out.line(`archive: '${this.options.archive.value}',`)
                }
                this.printChain()
            })
            this.out.line(`})`)
            if (this.options.finalityConfirmation != null) {
                this.out.line(`.setFinalityConfirmation(${this.options.finalityConfirmation})`)
            }
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
            this.out.line()
        })
        this.out.line(`export type Fields = EvmBatchProcessorFields<typeof processor>`)
        this.out.line(`export type Block = BlockHeader<Fields>`)
        this.out.line(`export type Log = _Log<Fields>`)
        this.out.line(`export type Transaction = _Transaction<Fields>`)

        return this.out.write()
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
                this.out.line(`.addLog({`)
                this.out.indentation(() => {
                    this.out.line(`address: ['${contract.address}'],`)
                    this.out.line(`topic0: [`)
                    this.out.indentation(() => {
                        for (let e in contract.events) {
                            this.out.line(`${contract.name}Abi.events['${e}'].topic,`)
                        }
                    })
                    this.out.line(`],`)
                    if (contract.range != null && (contract.range.from != null || contract.range.to != null)) {
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
                this.out.line(`.addTransaction({`)
                this.out.indentation(() => {
                    this.out.line(`to: ['${contract.address}'],`)
                    this.out.line(`sighash: [`)
                    this.out.indentation(() => {
                        for (let f in contract.functions) {
                            this.out.line(`${contract.name}Abi.functions['${f}'].sighash,`)
                        }
                    })
                    this.out.line(`],`)
                    if (contract.range != null && (contract.range.from != null || contract.range.to != null)) {
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
