import assert from 'assert'
import path from 'upath'
import {createLogger} from '@subsquid/logger'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {AbiDescription} from "@subsquid/ink-abi/lib/abi-description"
import {InkProject, getInkProject} from '@subsquid/ink-abi/lib/metadata/validator'
import {MappingCodegen} from './generators/mappings'
import {ABI, MAPPING, resolveModule} from './generators/paths'
import {ProcessorCodegen} from './generators/processor'
import {SchemaCodegen} from './generators/schema'
import {Config} from './schema'
import {SquidContract, SquidEntityField, SquidFragment} from './util/interfaces'
import {getArchive, readInkMetadata, parseTsType, spawnAsync} from './util/misc'
import {toEntityName} from './util/naming'
import {Interfaces} from "@subsquid/substrate-typegen/lib/ifs"

export let logger = createLogger(`sqd:squidgen`)

export async function generateSquid(config: Config) {
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
        logger.info(`processing "${contract.address}" contract...`)

        let metadata = readInkMetadata(contract.abi)
        let project = getInkProject(metadata)

        let name = (project.contract as any)?.name || contract.name
        if (name == undefined) {
            throw new Error(`Contract name can't be taken from the ABI and must be specified explicitly`)
        }

        let spec = contract.abi || contract.address
        let typegenArgs = [
            '--abi', contract.abi,
            '--output', path.join(cwd, typegenDir, contract.name + '.ts')
        ]

        await spawnAsync('/home/tmcgroul/projects/squid-wasm-abi-template/node_modules/.bin/squid-ink-typegen', typegenArgs)

        spec = path.basename(spec, '.json')

        let events = getEvents(project, name, contract.events || [])

        contracts.push({
            name,
            address: contract.address,
            events,
            range: contract.range,
        })
    }

    logger.info(`generating schema...`)

    new SchemaCodegen(outputDir, contracts).generate()

    logger.info(`running codegen...`)

    await spawnAsync(`/home/tmcgroul/projects/squid-wasm-abi-template/node_modules/.bin/squid-typeorm-codegen`, [])

    logger.info(`generating processor...`)

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
    for (let contract of config.contracts) {
        if (contract.name) {
            let name = toCamelCase(contract.name)
            assert(/^[a-zA-Z0-9]+$/.test(name), `Invalid contract name "${contract.name}"`)
        }
    }
}

function getEvents(project: InkProject, contractName: string, names: string[] | true) {
    let description = new AbiDescription(project)
    let ifs = new Interfaces(description.types(), new Map())

    let events: Record<string, SquidFragment> = {}
    for (let event of project.spec.events) {
        let entityName = toEntityName(contractName, `event`, event.label)
        let args: SquidEntityField[] = event.args.map(arg => {
            let {schemaType, required} = parseTsType(ifs.use(arg.type.type))
            return {
                name: arg.label,
                indexed: arg.indexed,
                schemaType,
                required,
            }
        })

        events[event.label] = {
            name: event.label,
            entity: {
                name: entityName,
                fields: args,
            }
        }
    }

    if (names === true) {
        names = Object.keys(events)
    }

    let fragments: SquidFragment[] = []
    for (let name of names) {
        let fragment = events[name]
        assert(fragment != null, `Event "${name}" doesn't exist for this contract`)
        fragments.push(fragment)
    }

    return fragments
}
