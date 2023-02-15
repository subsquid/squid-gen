import {createLogger} from '@subsquid/logger'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import path from 'upath'
import {Config} from './schema'
import {SquidContract, SpecFile} from './util/interfaces'
import {getArchive, spawnAsync} from './util/misc'
import {FragmentsParser} from './util/parser'
import {MAPPING, resolveModule, UTIL} from './generators/paths'
import {MappingCodegen} from './generators/mappings'
import {ProcessorCodegen} from './generators/processor'
import {SchemaCodegen} from './generators/schema'
import {logger} from './util/logger'

export async function generateSquid(config: Config) {
    let archive = getArchive(config.archive)

    let typegenDir = `./src/abi`

    let typegenArgs: string[] = []
    typegenArgs.push(typegenDir)
    typegenArgs.push(...config.contracts.map((c) => `${c.abi || c.address}#${toCamelCase(c.name)}`))
    typegenArgs.push(`--clean`)
    if (config.etherscanApi) {
        typegenArgs.push(`--etherscan-api=${config.etherscanApi}`)
    }

    logger.info(`running typegen...`)
    await spawnAsync(`squid-evm-typegen`, typegenArgs)

    let cwd = process.cwd()

    let contracts: SquidContract[] = []
    for (let contract of config.contracts) {
        let name = toCamelCase(contract.name)
        let address = contract.proxy || contract.address

        let specFile: SpecFile = require(path.join(cwd, typegenDir, `${name}.ts`))
        let parser = new FragmentsParser(name, specFile)
        let events = parser.getEvents(contract.events || [])
        let functions = parser.getFunctions(contract.functions || [])

        contracts.push({
            name,
            address,
            events,
            functions,
        })
    }

    // let from = opts.from ? parseInt(opts.from) : 0
    // if (from != null) {
    //     assert(Number.isSafeInteger(from))
    //     assert(from >= 0)
    // }

    logger.info(`generating schema...`)

    let outputDir = new OutDir(cwd)
    new SchemaCodegen(outputDir, contracts).generate()

    logger.info(`running codegen...`)
    await spawnAsync(`squid-typeorm-codegen`, [])

    logger.info(`generating processor...`)
    let srcOutputDir = outputDir.child(`src`)
    srcOutputDir.add(`${resolveModule(srcOutputDir.path(), UTIL)}.ts`, [__dirname, '../../support/util.ts'])

    let mappingsOutputDir = srcOutputDir.child(resolveModule(srcOutputDir.path(), MAPPING))
    for (let contract of contracts) {
        new MappingCodegen(mappingsOutputDir, contract).generate()
    }

    let mappingsIndex = mappingsOutputDir.file('index.ts')
    for (let contract of contracts) {
        mappingsIndex.line(`export * as ${contract.name} from './${contract.name}'`)
    }
    mappingsIndex.write()

    new ProcessorCodegen(srcOutputDir, {
        archive,
        contracts,
    }).generate()
}
