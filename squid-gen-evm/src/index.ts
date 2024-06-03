import assert from 'assert'
import {register} from 'ts-node'
import path from 'path'
import {createLogger} from '@subsquid/logger'
import {DataTarget, ParquetFileTarget, PostgresTarget} from '@subsquid/squid-gen-targets'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {Config} from './config'
import {MappingCodegen} from './mappings'
import {ProcessorCodegen} from './processor'
import {EscapedFragment, SpecFile, SquidContract} from './interfaces'
import {getArchive, getType, spawnAsync} from './util'
import {block, transaction, event as staticEvent, function_ as staticFunction} from './staticEntities'
import {Fragment} from '@subsquid/squid-gen-utils'
import {CoreCodegen} from './core'
import {Codec} from "@subsquid/evm-codec";

export let logger = createLogger(`sqd:squidgen`)

export async function generateSquid(config: Config) {
    register()

    validateContractNames(config)

    let archive = getArchive(config.archive)

    let cwd = process.cwd()
    let outputDir = new OutDir(cwd)

    let srcOutputDir = outputDir.child(`src`)
    srcOutputDir.del()

    let typegenDir = path.join(`src`, `abi`)

    logger.info(`running typegen...`)
    let contracts: SquidContract[] = []
    let fragments: Fragment[] = [block, transaction]
    for (let contract of config.contracts) {
        logger.info(`processing "${contract.name}" contract...`)

        let name = toCamelCase(contract.name)
        let spec = contract.abi || contract.address.toLowerCase()

        let typegenArgs: string[] = []
        typegenArgs.push(typegenDir)
        typegenArgs.push(`${spec}`)
        if (config.etherscanApi != null) {
            typegenArgs.push(`--etherscan-api=${config.etherscanApi}`)
        }
        if (process.env.ETHERSCAN_API_KEY != null) {
            typegenArgs.push(`--etherscan-api-key=${process.env.ETHERSCAN_API_KEY}`)
        }

        await spawnAsync(`squid-evm-typegen`, typegenArgs)

        spec = path.basename(spec, '.json')

        let address = contract.proxy || contract.address
        address = address.toLowerCase()

        let specFile: SpecFile = require(path.join(cwd, typegenDir, `${spec}`))
        let events = getEvents(specFile, name, contract.events || [])
        let functions = getFunctions(specFile, name, contract.functions || [])

        let range = contract.range

        contracts.push({
            name,
            spec,
            address,
            events,
            functions,
            range,
        })
        fragments.push(...Object.values(events))
        fragments.push(...Object.values(functions))
    }

    logger.info(`running codegen...`)
    let dataTarget: DataTarget
    switch (config.target.type) {
        case 'postgres':
            const options = {
                stateSchema: config.target?.stateSchema,
                saveStrategy: config.target?.saveStrategy,
            }
            dataTarget = new PostgresTarget(srcOutputDir, fragments, options)
            break
        case 'parquet':
            dataTarget = new ParquetFileTarget(srcOutputDir, fragments, {path: config.target.path})
            break
    }
    await dataTarget.generate()

    logger.info(`generating processor...`)

    new ProcessorCodegen(srcOutputDir, {
        contracts,
        archive,
        chain: config.chain,
        finalityConfirmation: config.finalityConfirmation,
    }).generate()

    let mappingsOutputDir = srcOutputDir.child(path.relative(srcOutputDir.path(), path.resolve(`src`, 'mapping')))
    for (let contract of contracts) {
        new MappingCodegen(mappingsOutputDir, {contract, dataTarget}).generate()
    }

    let mappingsIndex = mappingsOutputDir.file('index.ts')
    for (let contract of contracts) {
        mappingsIndex.line(`export * as ${contract.name} from './${contract.name}'`)
    }
    mappingsIndex.write()

    new CoreCodegen(srcOutputDir, {
        contracts,
        dataTarget,
    }).generate()
}

function validateContractNames(config: Config) {
    for (let contract of config.contracts) {
        let name = toCamelCase(contract.name)
        assert(/^[a-zA-Z0-9]+$/.test(name), `Invalid contract name "${contract.name}"`)
    }
}

function getEvents(specFile: SpecFile, contractName: string, names: string[] | true) {
    let items = specFile.events || {}

    const filteredNames = names === true ? Object.keys(items) : names

    const events: Record<string, EscapedFragment> = {}
    for (const name of filteredNames) {
        const event = items[name]
        assert(event != null, `Event "${name}" doesn't exist for this contract`)

        events[name] = {
            name: `${contractName}_event_${name}`,
            params: [...staticEvent.params, ...Object.entries(event.params).map(([name, param]: [string, Codec<any> & {indexed?: boolean}]) => ({
                name: toEventParamName(name),
                originalName: name,
                type: getType(param),
                indexed: !!param.indexed,
                nullable: false,
                static: !param.isDynamic,
            }))]
        }
    }

    return events
}

function getFunctions(specFile: SpecFile, contractName: string, names: string[] | true) {
    const items = specFile.functions || {}

    const filteredNames = names === true ? Object.keys(items) : names

    const functions: Record<string, EscapedFragment> = {}
    for (const name of filteredNames) {
        const fun= items[name]
        assert(fun != null, `Function "${name}" doesn't exist for this contract`)

        if (fun.isView) {
            logger.warn(`readonly function "${name}" skipped`)
            continue
        }

        functions[name] = {
            name: `${contractName}_function_${name}`,
            params: [...staticFunction.params, ...Object.entries(fun.args as Record<string, Codec<any>>).map(([name, param]) => ({
                name: toFunctionParamName(name),
                type: getType(param),
                indexed: false,
                nullable: false,
                static: !param.isDynamic,
            }))],
        }
    }

    return functions
}

// in case of name conflicts, like event arg named `id`
function toEventParamName(name: string) {
    if (staticEvent.params.some((p) => p.name === name)) {
        return `param_${name}`
    }
    return name
}

function toFunctionParamName(name: string) {
    if (staticFunction.params.some((p) => p.name === name)) {
        return `param_${name}`
    }
    return name
}
