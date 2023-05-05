import {program} from 'commander'
import {runProgram} from '@subsquid/util-internal'
import {read, validate} from '@subsquid/util-internal-config'
import {Config} from '../config'
import CONFIG_SCHEMA from '../config.schema.json'
import {generateSquid} from '..'
import path from 'path'
import * as yaml from 'yaml'
import fs from 'fs'

program
    .addHelpText(
        'before',
        'Generates code for a squid indexing specific EVM events and functions for each provided contract. Run within a folder cloned from https://github.com/subsquid-labs/squid-abi-template.\n'
    )
    .argument('<config>', '(required) A YAML configuration file.')
    .addHelpText(
        'after',
        '\nExample config:\n\n' +
        'archive: eth-mainnet\n' +
        'target:\n' +
        '  type: postgres\n' +
        'contracts:\n' +
        '  - name: Gravatar\n' +
        '    address: "0x2E645469f354BB4F5c8a05B3b30A929361cf77eC"\n' +
        '    events: true\n' +
        '    functions: true\n' +
        'etherscanApi: https://api.etherscan.io\n\n' +
        'See the full configuration file schema at node_modules/@subsquid/squid-gen-evm/lib/config.schema.json (JSON schema) or at node_modules/@subsquid/squid-gen-evm/lib/config.d.ts (Typescript).'
    )

runProgram(async function () {
    let configFile = program.parse().processedArgs[0]
    let config = await readConfig(configFile)

    await generateSquid(config)
})

async function readConfig(file: string): Promise<Config> {
    switch (path.extname(file)) {
        case '.yaml':
        case '.yml':
            let content = fs.readFileSync(file, 'utf-8')
            let config = yaml.parse(content)
            validate(config, CONFIG_SCHEMA)
            return config
        case '.json':
            return read(file, CONFIG_SCHEMA)
        default:
            throw new Error(`Unsupported config format "${path.extname(file)}"`)
    }
}
