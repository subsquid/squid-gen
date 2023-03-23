import assert from 'assert'
import path from 'path'
import {AbiDescription} from '@subsquid/ink-abi/lib/abi-description'
import {InkProject, getInkProject} from '@subsquid/ink-abi/lib/metadata/validator'
import {createLogger} from '@subsquid/logger'
import {DataTarget, ParquetFileTarget, PostgresTarget} from '@subsquid/squid-gen-targets'
import {Fragment, FragmentParam, spawnAsync} from '@subsquid/squid-gen-utils'
import {Interfaces} from '@subsquid/substrate-typegen/lib/ifs'
import {OutDir} from '@subsquid/util-internal-code-printer'
import {toCamelCase} from '@subsquid/util-naming'
import {Config} from './config'
import {SquidContract} from './interfaces'
import {MappingCodegen} from './mappings'
import {ProcessorCodegen} from './processor'
import {block, event} from './staticEntities'
import {getArchive, getType, readInkMetadata} from './util'

export let logger = createLogger(`sqd:squidgen`)

export async function generateSquid(config: Config) {
    validateContractNames(config)

    let archive = getArchive(config.archive)

    let cwd = process.cwd()
    let outputDir = new OutDir(cwd)

    let srcOutputDir = outputDir.child(`src`)
    srcOutputDir.del()

    let typegenDir = path.join(`src`, `abi`)

    logger.info(`running typegen...`)
    let contracts: SquidContract[] = []
    let fragments: Fragment[] = [block]
    for (let contract of config.contracts) {
        logger.info(`processing "${contract.address}" contract...`)

        let metadata = readInkMetadata(contract.abi)
        let project = getInkProject(metadata)

        let name = (project.contract as any)?.name || contract.name
        if (name == undefined) {
            throw new Error(`Contract name can't be taken from the ABI and must be specified explicitly`)
        }

        let spec = contract.abi || contract.address
        let typegenArgs = ['--abi', contract.abi, '--output', path.join(cwd, typegenDir, contract.name + '.ts')]

        await spawnAsync('squid-ink-typegen', typegenArgs)

        spec = path.basename(spec, '.json')

        let events = getEvents(project, name, contract.events || [])

        contracts.push({
            name,
            address: contract.address,
            events,
            range: contract.range,
        })
        fragments.push(...Object.values(events))
    }

    logger.info(`running codegen...`)
    let dataTarget: DataTarget
    switch (config.target.type) {
        case 'postgres':
            dataTarget = new PostgresTarget(srcOutputDir, fragments, {})
            break
        case 'parquet':
            dataTarget = new ParquetFileTarget(srcOutputDir, fragments, {path: config.target.path})
            break
    }
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
        if (contract.name) {
            let name = toCamelCase(contract.name)
            assert(/^[a-zA-Z0-9]+$/.test(name), `Invalid contract name "${contract.name}"`)
        }
    }
}

function getEvents(project: InkProject, contractName: string, names: string[] | true) {
    let description = new AbiDescription(project)
    let ifs = new Interfaces(description.types(), new Map())

    let fragments: Record<string, Fragment> = {}
    for (let fragment of project.spec.events) {
        let params: FragmentParam[] = [...event.params]
        for (let param of fragment.args) {
            let {type, nullable} = getType(ifs.use(param.type.type))

            params.push({
                name: param.label,
                indexed: param.indexed,
                type,
                nullable,
            })
        }

        fragments[fragment.label] = {
            name: `${contractName}_event_${fragment.label}`,
            params,
        }
    }

    names = names == true ? Object.keys(fragments) : names

    let filtered: Record<string, Fragment> = {}
    for (let name of names) {
        let fragment = fragments[name]
        assert(fragment != null, `Event "${name}" doesn't exist for this contract`)

        filtered[name] = fragment
    }

    return filtered
}
