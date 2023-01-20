import assert from 'assert'
import {spawn} from 'child_process'
import path from 'path'
import {program} from 'commander'
import {ethers, utils} from 'ethers'
import {register} from 'ts-node'
import {getType as getTsType} from '@subsquid/evm-typegen/lib/util/types'
import {createLogger} from '@subsquid/logger'
import {runProgram} from '@subsquid/util-internal'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {SquidFragment, SquidFragmentParam, TypegenOutput} from './interfaces'
import {ProcessorCodegen} from './processor'
import {SchemaCodegen} from './schema'

runProgram(async function () {
    register()

    program
        .requiredOption(`--address <contract>`, `contract address`)
        .requiredOption(
            `--archive <url>`,
            `Archive endpoint for indexing. See https://docs.subsquid.io/ for the list of supported networks and Archive endpoints`
        )
        .option(`--proxy <contract>`, `proxy contract address`)
        .option(`--abi <path>`, `path or URL to the contract ABI`)
        .option(
            `-e, --event <name...>`,
            `one or multiple contract events to be indexed. '*' indexes all events defined in the ABI`
        )
        .option(
            `-f, --function <name...>`,
            `one or multiple contract functions to be indexed. '*' indexes all functions defined in the ABI`
        )
        .option(`--from <block>`, `start indexing from the given block`)
        .option(
            `--etherscan-api <url>`,
            `an Etherscan API endpoint to fetch contract ABI by a known address. Default: https://api.etherscan.io/`
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

    let logger = createLogger(`sqd:abi-gen`)

    let typegenArgs: string[] = []
    typegenArgs.push(`./src/abi`)
    typegenArgs.push(opts.abi || opts.address)
    typegenArgs.push(`--clean`)
    if (opts.etherscanApi) {
        typegenArgs.push(`--etherscan-api ${opts.etherscanApi}`)
    }

    logger.info(`running typegen...`)
    await spawnAsync(`squid-evm-typegen`, typegenArgs)

    let cwd = process.cwd()

    let typegenFileName = opts.abi ? path.basename(opts.abi, `.json`) : opts.address
    let typegenFile = require(path.join(cwd, `./src/abi/${typegenFileName}.ts`))

    let events = getFragments(`event`, typegenFile, opts.event || [])
    let functions = getFragments(`function`, typegenFile, opts.function || [])

    let from = opts.from ? parseInt(opts.from) : 0
    if (from != null) {
        assert(Number.isSafeInteger(from))
        assert(from >= 0)
    }

    logger.info(`generating schema...`)
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
        archive: opts.archive,
        typegenFileName,
        events,
        functions,
        from,
    }).generate()
})

const STATIC_ENTITY_FIELDS: ReadonlyArray<string> = ['id', 'name', 'block', 'transaction']

function getFragments(kind: 'event' | 'function', typegenFile: TypegenOutput, names: string[]): SquidFragment[] {
    let items = kind === 'event' ? typegenFile.events : typegenFile.functions

    if (names.includes(`*`)) {
        names = Object.keys(items)
    }

    let overloads: Record<string, number> = {}
    let fragments: SquidFragment[] = []
    for (let name of names) {
        let fragment = items[name]?.fragment
        assert(fragment != null, `${kind === 'event' ? `Event` : `Function`} "${name}" doesn't exist for this contract`)

        let entityName = toEntityName(fragment.name)
        if (overloads[entityName] == null) {
            if (Object.values(items).reduce((c, i) => (i.fragment.name === fragment.name ? c + 1 : c), 0) > 1) {
                entityName += 0
                overloads[entityName] = 1
            }
        } else if (overloads[entityName] != null) {
            entityName += overloads[entityName]
            overloads[entityName] += 1
        }
        entityName += kind === 'event' ? `Event` : `Function`

        let params: SquidFragmentParam[] = []
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            let overlaps: Record<string, number> = {}
            let fieldName: string
            if (input.name) {
                fieldName = toFieldName(input.name)
                if (overlaps[fieldName] == null) {
                    if (
                        STATIC_ENTITY_FIELDS.indexOf(fieldName) > -1 ||
                        fragment.inputs.reduce((c, i) => (toFieldName(i.name) === fieldName ? c + 1 : c), 0) > 1
                    ) {
                        fieldName += 0
                        overlaps[fieldName] = 1
                    }
                } else {
                    fieldName += overlaps[fieldName]
                    overlaps[fieldName] += 1
                }
            } else {
                fieldName = `arg${i}`
            }
            params.push({
                name: fieldName,
                indexed: input.indexed,
                schemaType: getGqlType(input),
            })
        }

        fragments.push({
            name,
            entityName,
            params,
        })
    }

    return fragments
}

function getGqlType(param: ethers.utils.ParamType): string {
    let tsType = getTsType(param)
    return tsTypeToGqlType(tsType)
}

function tsTypeToGqlType(type: string): string {
    if (type === 'string') {
        return 'String'
    } else if (type === 'boolean') {
        return 'Boolean'
    } else if (type === 'number') {
        return 'Int'
    } else if (type === 'ethers.BigNumber') {
        return 'BigInt'
    } else {
        return 'JSON'
    }
}

function toEntityName(name: string) {
    let camelCased = toCamelCase(name)
    return camelCased.slice(0, 1).toUpperCase() + camelCased.slice(1)
}

function toFieldName(name: string) {
    return toCamelCase(name)
}

async function spawnAsync(command: string, args: string[]) {
    return await new Promise<number>((resolve, reject) => {
        let proc = spawn(command, args, {
            stdio: 'inherit',
            shell: process.platform == 'win32',
        })

        proc.on('error', (err) => {
            reject(err)
        })

        proc.on('close', (code) => {
            if (code == 0) {
                resolve(code)
            } else {
                reject(`error: command "${command}" exited with code ${code}`)
            }
        })
    })
}
