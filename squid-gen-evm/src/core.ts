import path from 'path'
import {DataTarget} from '@subsquid/squid-gen-targets'
import {resolveModule} from '@subsquid/squid-gen-utils'
import {def} from '@subsquid/util-internal'
import {FileOutput, OutDir} from '@subsquid/util-internal-code-printer'
import {SquidContract} from './interfaces'
import {block, transaction} from './staticEntities'

export class CoreCodegen {
    private out: FileOutput

    private mappings = new Set<string>()

    constructor(
        private outDir: OutDir,
        private options: {
            contracts: SquidContract[]
            dataTarget: DataTarget
        }
    ) {
        this.out = this.outDir.file(`main.ts`)
    }

    generate() {
        this.printImports()
        this.out.line()
        let targetPrinter = this.getTargetPrinter()
        this.out.line(`processor.run(db, async (ctx) => {`)
        this.out.indentation(() => {
            targetPrinter.printPreBatch()
            this.out.block(`for (let block of ctx.blocks)`, () => {
                targetPrinter.printFragmentSave(block, [
                    `block.header.id`,
                    `block.header.height`,
                    `new Date(block.header.timestamp)`,
                ])
                this.out.line()
                this.out.block(`for (let log of block.logs)`, () => {
                    for (let contract of this.options.contracts) {
                        this.out.block(`if (log.address === '${contract.address}')`, () => {
                            this.useMapping(contract.name)
                            this.out.line(`${contract.name}.parseEvent(ctx, log)`)
                        })
                    }
                })
                this.out.line()
                this.out.block(`for (let transaction of block.transactions)`, () => {
                    for (let contract of this.options.contracts) {
                        this.out.block(`if (transaction.to === '${contract.address}')`, () => {
                            this.useMapping(contract.name)
                            this.out.line(`${contract.name}.parseFunction(ctx, transaction)`)
                        })
                    }
                    this.out.line()
                    targetPrinter.printFragmentSave(transaction, [
                        `transaction.id`,
                        `block.header.height`,
                        `new Date(block.header.timestamp)`,
                        `transaction.hash`,
                        `transaction.to`,
                        `transaction.from`,
                        `transaction.status`,
                    ])
                })
            })
            this.out.line()
            targetPrinter.printPostBatch()
        })
        this.out.line(`})`)
        return this.out.write()
    }

    private printImports() {
        let targetPrinter = this.getTargetPrinter()
        this.out.lazy(() => {
            if (this.mappings.size > 0) {
                this.out.line(
                    `import {${[...this.mappings].join(`, `)}} from '${resolveModule(
                        this.out.file,
                        path.resolve(`src`, `mapping`)
                    )}'`
                )
            }
            this.out.line(`import {processor} from '${resolveModule(this.out.file, path.resolve(`src`, `processor`))}'`)
            this.out.line(`import {db, Store} from '${resolveModule(this.out.file, path.resolve(`src`, `db`))}'`)
            targetPrinter.printImports()
        })
    }

    private useMapping(str: string) {
        this.mappings.add(str)
    }

    @def
    private getTargetPrinter() {
        return this.options.dataTarget.createPrinter(this.out)
    }
}
