import assert from 'assert'
import path from 'path'
import {program} from 'commander'
import {register} from 'ts-node'
import {createLogger} from '@subsquid/logger'
import {runProgram} from '@subsquid/util-internal'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {SquidArchive} from '../util/interfaces'
import {ProcessorCodegen} from './processor'
import {SchemaCodegen} from './schema'
import {isURL, spawnAsync} from '../util/misc'
import {FragmentsParser} from '../util/parser'
import {knownArchivesEVM} from '@subsquid/archive-registry'

let logger = createLogger(`sqd:gen`)

runProgram(async function () {
    register()

    program
        .addHelpText(
            'before',
            'Generates code for a squid indexing given EVM events and functions. Run within a folder cloned from https://github.com/subsquid/squid-abi-template.\n'
        )
        .requiredOption(`--address <contract>`, `Contract address. Implementation address for proxy contracts.`)
        .requiredOption(
            `--archive <alias|url>`,
            `Source Squid Archive for an EVM network. Can be a URL or an alias defined by @subsquid/archive-registry. See also https://docs.subsquid.io/ for the list of supported EVM networks.`
        )
        .option(`--proxy <contract>`, `(optional) Proxy contract address.`)
        .option(
            `--abi <path>`,
            `(optional) Path or URL to the contract JSON ABI. If omitted, it will be retrieved from Etherscan by address.`
        )
        .option(
            `-e, --event <name...>`,
            `One or multiple contract events to be indexed. '*' indexes all events defined in the ABI.`
        )
        .option(
            `-f, --function <name...>`,
            `One or multiple contract functions to be indexed. '*' indexes all functions defined in the ABI.`
        )
        .option(`--from <block>`, `Start indexing from the given block.`)
        .option(
            `--etherscan-api <url>`,
            `Etherscan API-compatible endpoint to fetch contract ABI by a known address. Default: https://api.etherscan.io/.`
        )
        .addHelpText(
            'after',
            "\nExample:\nsquid-gen-abi --address 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC --archive https://eth.archive.subsquid.io --event NewGravatar UpdatedGravatar --function '*' --from 6000000"
        )

    program.parse()
    let opts = program.opts() as {
        address: string
        archive: string
        proxy?: string
        abi?: string
        event?: string[]
        function?: string[]
        from?: string
        etherscanApi?: string
    }

    let archive = getArchive(opts.archive)

    let typegenArgs: string[] = []
    typegenArgs.push(`./src/abi`)
    typegenArgs.push(opts.abi || opts.address)
    typegenArgs.push(`--clean`)
    if (opts.etherscanApi) {
        typegenArgs.push(`--etherscan-api=${opts.etherscanApi}`)
    }

    logger.info(`running typegen...`)
    await spawnAsync(`squid-evm-typegen`, typegenArgs)

    let cwd = process.cwd()

    let typegenFileName = opts.abi ? path.basename(opts.abi, `.json`) : opts.address
    let typegenFile = require(path.join(cwd, `./src/abi/${typegenFileName}.ts`))

    let from = opts.from ? parseInt(opts.from) : 0
    if (from != null) {
        assert(Number.isSafeInteger(from))
        assert(from >= 0)
    }

    logger.info(`generating schema...`)
    let parser = new FragmentsParser(typegenFile)
    let events = parser.getEvents(opts.event || [])
    let functions = parser.getFunctions(opts.function || [])

    let outputDir = new OutDir(cwd)
    new SchemaCodegen(outputDir, {
        events,
        functions,
    }).generate()

    logger.info(`running codegen...`)
    await spawnAsync(`squid-typeorm-codegen`, [])

    logger.info(`generating processor...`)
    let srcOutputDir = outputDir.child(`src`)
    new ProcessorCodegen(srcOutputDir, {
        address: (opts.proxy || opts.address).toLowerCase(),
        archive,
        typegenFileName,
        events,
        functions,
        from,
    }).generate()
})

function getArchive(str: string): SquidArchive {
    if (isURL(str)) {
        return {
            value: str,
            kind: 'url',
        }
    } else if (knownArchivesEVM.includes(str as any)) {
        return {
            value: str,
            kind: 'name',
        }
    } else {
        throw new Error(`Invalid archive "${str}"`)
    }
}
