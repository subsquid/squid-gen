import {program} from 'commander'
import {runProgram} from '@subsquid/util-internal'
import {read, validate} from '@subsquid/util-internal-config'
import {Config} from '../schema'
import CONFIG_SCHEMA from '../schema.json'
import {generateSquid} from '../squid'
import path from 'path'
import * as yaml from 'yaml'
import fs from 'fs'

program
    .addHelpText(
        'before',
        'Generates code for squid that can index specific ink events for each provided contract. Run within a folder cloned from https://github.com/subsquid/squid-wasm-abi-template.\n'
    )
    .argument('<config>', '(required) A JSON configuration file. See the full schema below.')
    .addHelpText(
        'after',
        '\nFull schema (TypeScript-like):\n' +
            '{\n' +
            '    archive: string; // Source Squid Archive for a network. Can be a URL or\n' +
            '                     // an alias. See https://docs.subsquid.io/archives/overview\n' +
            '    contracts: ContractJSON[]; // ContractJSONs defining the exact data to\n' +
            '                               // extract from each contract. See details below.\n' +
            '}\nwhere\n' +
            'ContractJSON {\n' +
            '    name: string; // Contract string name.\n' +
            '    address: string; // Contract address.\n' +
            '    abi: string; // (optional) Path to the contract JSON ABI.\n' +
            '    events?: string[] | boolean; // One or multiple contract events to be\n' +
            '                                 // indexed. true indexes all events defined in\n' +
            '                                 // the ABI; false indexes none. Default: false\n' +
            '    range?: { // Range of blocks to index. Default: all from the genesis.\n' +
            '        from?: number;\n' +
            '        to?: number;\n' +
            '    };\n' +
            '}\n\n' +
            'Example:\n' +
            '{\n' +
            '    "archive": "shibuya",\n' +
            '    "contracts": [\n' +
            '        {\n' +
            '            "name": "erc20",\n' +
            '            "address": "0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72",\n' +
            '            "events": true,\n' +
            '        }\n' +
            '    ]\n' +
            '}\n'
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
            throw new Error(`Unsupported file extension "${path.extname(file)}"`)
    }
}
