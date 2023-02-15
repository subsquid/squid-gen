import {program} from 'commander'
import {register} from 'ts-node'
import {runProgram} from '@subsquid/util-internal'
import {read} from '@subsquid/util-internal-config'
import {Config} from '../schema'
import CONFIG_SCHEMA from '../schema.json'
import {generateSquid} from '../squid'

runProgram(async function () {
    register()

    program.argument('<config>').parse()

    let configFile = program.parse().processedArgs[0]
    let config = await readConfig(configFile)

    await generateSquid(config)
})

async function readConfig(file: string): Promise<Config> {
    return read(file, CONFIG_SCHEMA)
}
