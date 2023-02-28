import assert from 'assert'
import path from 'upath'
import {createLogger} from '@subsquid/logger'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {MappingCodegen} from './generators/mappings'
import {ABI, MAPPING, UTIL, resolveModule} from './generators/paths'
import {ProcessorCodegen} from './generators/processor'
import {SchemaCodegen} from './generators/schema'
import {Config} from './schema'
import {SpecFile, SquidContract, SquidEntityField, SquidFragment} from './util/interfaces'
import {getArchive, getGqlType, spawnAsync} from './util/misc'
import {toEntityName, toFieldName} from './util/naming'
import {event, function_} from './util/staticEntities'
import {register} from 'ts-node'

export let logger = createLogger(`sqd:squidgen`)

export async function generateSquid(config: Config) {
    register()

    validateContractNames(config)

    let archive = getArchive(config.archive)

    let cwd = process.cwd()
    let outputDir = new OutDir(cwd)

    let srcOutputDir = outputDir.child(`src`)
    srcOutputDir.del()

    let typegenDir = ABI

    logger.info(`running typegen...`)
    let contracts: SquidContract[] = []
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
    }

    logger.info(`generating schema...`)

    new SchemaCodegen(outputDir, contracts).generate()

    logger.info(`running codegen...`)
    await spawnAsync(`squid-typeorm-codegen`, [])

    logger.info(`generating processor...`)
    srcOutputDir.add(`${resolveModule(srcOutputDir.path(), UTIL)}.ts`, [__dirname, '../support/util.ts'])

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

function validateContractNames(config: Config) {
    // let names = new Set<string>()
    for (let contract of config.contracts) {
        let name = toCamelCase(contract.name)
        assert(/^[a-zA-Z0-9]+$/.test(name), `Invalid contract name "${contract.name}"`)
        // assert(!names.has(name), `Duplicate contract name "${contract.name}"`)
        // names.add(name)
    }
}

function getEvents(specFile: SpecFile, contractName: string, names: string[] | true) {
    let fragments: Record<string, SquidFragment> = {}

    let items = specFile.events

    let overloads: Record<string, number> = {}

    for (let name in items) {
        let fragment = items[name].fragment

        let entityName = toEntityName(contractName, `event`, fragment.name)
        while (true) {
            let overloadIndex = overloads[entityName]
            if (overloadIndex == null) {
                let ols = specFile.abi.fragments.filter(
                    (f) => f.type === fragment.type && toEntityName(contractName, `event`, f.name) === entityName
                )
                if (ols.length > 1) {
                    overloadIndex = overloads[entityName] = 0
                } else if (ols.length > 0 && entityName !== toEntityName(contractName, `event`, fragment.name)) {
                    overloadIndex = overloads[entityName] = 0
                } else {
                    break
                }
            }
            overloads[entityName] += 1
            entityName += overloadIndex
        }

        let params: SquidEntityField[] = []
        let overlaps: Record<string, number> = {}
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            let fieldName: string
            if (input.name) {
                fieldName = toFieldName(input.name)
            } else {
                fieldName = `arg${i}`
            }
            while (true) {
                let overlapIndex = overlaps[fieldName]
                if (overlapIndex == null) {
                    let ols = fragment.inputs.filter((i) => i.name != null && toFieldName(i.name) === fieldName)
                    if (ols.length > 1 || event.fields.some((f) => f.name === fieldName)) {
                        overlapIndex = overlaps[fieldName] = 0
                    } else if (ols.length > 0 && (input.name == null || fieldName !== toFieldName(input.name))) {
                        overlapIndex = overlaps[fieldName] = 0
                    } else {
                        break
                    }
                }
                overlaps[fieldName] += 1
                let prevName = fieldName
                fieldName += overlapIndex
                logger.warn(`"${prevName}" field renamed to "${fieldName}" for ${entityName} due to collision`)
            }

            params.push({
                name: fieldName,
                indexed: input.indexed,
                schemaType: getGqlType(input),
                required: true,
            })
        }

        fragments[name] = {
            name,
            entity: {
                name: entityName,
                fields: params,
            },
        }
    }

    if (names === true) {
        names = Object.keys(fragments)
    }

    let res: SquidFragment[] = []
    for (let name of names) {
        let fragment = fragments[name]
        assert(fragment != null, `Event "${name}" doesn't exist for this contract`)

        res.push(fragment)
    }

    return res
}

function getFunctions(specFile: SpecFile, contractName: string, names: string[] | true) {
    let fragments: Record<string, SquidFragment> = {}

    let items = specFile.functions

    let overloads: Record<string, number> = {}

    for (let name in items) {
        let fragment = items[name].fragment

        let entityName = toEntityName(contractName, `function`, fragment.name)
        while (true) {
            let overloadIndex = overloads[entityName]
            if (overloadIndex == null) {
                let ols = specFile.abi.fragments.filter(
                    (f) => f.type === fragment.type && toEntityName(contractName, `function`, f.name) === entityName
                )
                if (ols.length > 1) {
                    overloadIndex = overloads[entityName] = 0
                } else if (ols.length > 0 && entityName !== toEntityName(contractName, `function`, fragment.name)) {
                    overloadIndex = overloads[entityName] = 0
                } else {
                    break
                }
            }
            overloads[entityName] += 1
            entityName += overloadIndex
        }

        let params: SquidEntityField[] = []
        let overlaps: Record<string, number> = {}
        for (let i = 0; i < fragment.inputs.length; i++) {
            let input = fragment.inputs[i]
            let fieldName: string
            if (input.name) {
                fieldName = toFieldName(input.name)
            } else {
                fieldName = `arg${i}`
            }
            while (true) {
                let overlapIndex = overlaps[fieldName]
                if (overlapIndex == null) {
                    let ols = fragment.inputs.filter((i) => i.name != null && toFieldName(i.name) === fieldName)
                    if (ols.length > 1 || function_.fields.some((f) => f.name === fieldName)) {
                        overlapIndex = overlaps[fieldName] = 0
                    } else if (ols.length > 0 && (input.name == null || fieldName !== toFieldName(input.name))) {
                        overlapIndex = overlaps[fieldName] = 0
                    } else {
                        break
                    }
                }
                overlaps[fieldName] += 1
                let prevName = fieldName
                fieldName += overlapIndex
                logger.warn(`"${prevName}" field renamed to "${fieldName}" for ${entityName} due to collision`)
            }

            params.push({
                name: fieldName,
                indexed: input.indexed,
                schemaType: getGqlType(input),
                required: true,
            })
        }

        fragments[name] = {
            name,
            entity: {
                name: entityName,
                fields: params,
            },
        }
    }

    if (names === true) {
        names = Object.keys(fragments)
    }

    let res: SquidFragment[] = []
    for (let name of names) {
        let fragment = fragments[name]
        assert(fragment != null, `Function "${name}" doesn't exist for this contract`)

        if (specFile.functions[name].fragment.stateMutability === 'view') {
            logger.warn(`readonly function "${name}" skipped`)
            continue
        }

        res.push(fragment)
    }

    return res
}
