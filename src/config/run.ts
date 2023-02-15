import path from 'path'
import {program} from 'commander'
import {register} from 'ts-node'
import {createLogger} from '@subsquid/logger'
import {runProgram} from '@subsquid/util-internal'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {read} from '@subsquid/util-internal-config'
import {ProcessorCodegen} from '../abi/processor'
import {SchemaCodegen} from '../abi/schema'
import {SpecFile, SquidContract} from '../util/interfaces'
import {getArchive, spawnAsync} from '../util/misc'
import {FragmentsParser} from '../util/parser'
import {Config} from './schema'
import {toCamelCase} from '@subsquid/util-naming'
import CONFIG_SCHEMA from './schema.json'

let logger = createLogger(`sqd:gen`)

runProgram(async function () {
    register()

    program.argument('<config>').parse()

    let configFile = program.parse().processedArgs[0]
    let config = await readConfig(configFile)

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
    new ProcessorCodegen(srcOutputDir, {
        archive,
        contracts,
    }).generate()
})

async function readConfig(file: string): Promise<Config> {
    return read(file, CONFIG_SCHEMA)
}
