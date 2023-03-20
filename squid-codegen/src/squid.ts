import assert from 'assert'
import ethers from 'ethers'
import {register} from 'ts-node'
import path from 'path'
import {createLogger} from '@subsquid/logger'
import {Fragment, FragmentParam, ParamType, PostgresTarget} from '@subsquid/squid-gen-targets'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {Config} from './config'
import {MappingCodegen} from './mappings'
import {ProcessorCodegen} from './processor'
import {SpecFile, SquidContract} from './util/interfaces'
import {getArchive, spawnAsync} from './util/misc'
import {block, event, function_, transaction} from './util/staticEntities'

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
    let dataTarget = new PostgresTarget(srcOutputDir, fragments, {})
    await dataTarget.generate()

    logger.info(`generating processor...`)
    srcOutputDir.add(
        path.relative(srcOutputDir.path(), path.resolve(`src`, `util.ts`)),
        path.join(__dirname, `..`, `support`, `util.ts`)
    )

    let mappingsOutputDir = srcOutputDir.child(path.relative(srcOutputDir.path(), path.resolve(`src`, 'mapping')))
    for (let contract of contracts) {
        new MappingCodegen(mappingsOutputDir, {contract, dataTarget}).generate()
    }

    let mappingsIndex = mappingsOutputDir.file('index.ts')
    for (let contract of contracts) {
        mappingsIndex.line(`export * as ${contract.name} from './${contract.name}'`)
    }
    mappingsIndex.write()

    new ProcessorCodegen(srcOutputDir, {
        contracts,
        dataTarget,
        archive,
    }).generate()
}

function validateContractNames(config: Config) {
    for (let contract of config.contracts) {
        let name = toCamelCase(contract.name)
        assert(/^[a-zA-Z0-9]+$/.test(name), `Invalid contract name "${contract.name}"`)
    }
}

function getEvents(specFile: SpecFile, contractName: string, names: string[] | true) {
    let items = specFile.events

    let fragments: Record<string, Fragment> = {}
    for (let name in items) {
        let fragment = items[name].fragment

        let params: FragmentParam[] = event.params
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]

            params.push({
                name: input.name || `param${i}`,
                indexed: input.indexed,
                type: getType(input),
                nullable: false,
            })
        }

        fragments[name] = {
            name: `${contractName}_event_${fragment.name}`,
            params,
        }
    }

    names = names == true ? Object.keys(items) : names

    let filtered: Record<string, Fragment> = {}
    for (let name of names) {
        let fragment = fragments[name]
        assert(fragment != null, `Event "${name}" doesn't exist for this contract`)

        filtered[name] = fragment
    }

    return filtered
}

function getFunctions(specFile: SpecFile, contractName: string, names: string[] | true) {
    let items = specFile.functions

    let fragments: Record<string, Fragment> = {}
    for (let name in items) {
        let fragment = items[name].fragment

        let params: FragmentParam[] = function_.params
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            params.push({
                name: input.name || `param${i}`,
                indexed: input.indexed,
                type: getType(input),
                nullable: false,
            })
        }

        fragments[name] = {
            name: `${contractName}_function_${fragment.name}`,
            params,
        }
    }

    names = names == true ? Object.keys(items) : names

    let filtered: Record<string, Fragment> = {}
    for (let name of names) {
        let fragment = fragments[name]
        assert(fragment != null, `Function "${name}" doesn't exist for this contract`)

        if (specFile.functions[name].fragment.stateMutability === 'view') {
            logger.warn(`readonly function "${name}" skipped`)
            continue
        }

        filtered[name] = fragment
    }

    return filtered
}

function getType(param: ethers.utils.ParamType): ParamType {
    if (param.baseType === 'array' || param.baseType === 'tuple') {
        return 'json'
    }

    if (param.type === 'address' || param.type === 'string') {
        return 'string'
    }

    if (param.type === 'bool') {
        return 'boolean'
    }

    let match = param.type.match(/^(u?int)([0-9]+)$/)
    if (match) {
        return parseInt(match[2]) < 53 ? 'int' : 'bigint'
    }

    if (param.type.substring(0, 5) === 'bytes') {
        return 'string'
    }

    throw new Error('unknown type')
}
