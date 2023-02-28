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
        'Generates code for squid that can index specific EVM events and functions for each provided contract. Run within a folder cloned from https://github.com/subsquid/squid-abi-template.\n'
    )
    .argument('<config>', '(required) A JSON configuration file. See the full schema below.')
    .addHelpText(
        'after',
        '\nFull schema (TypeScript-like):\n' +
            '{\n' +
            '    archive: string; // Source Squid Archive for an EVM network. Can be a URL or\n' +
            '                     // an alias. See https://docs.subsquid.io/archives/overview\n' +
            '    contracts: ContractJSON[]; // ContractJSONs defining the exact data to\n' +
            '                               // extract from each contract. See details below.\n' +
            '    etherscanApi?: string; // (optional) Etherscan API-compatible endpoint to\n' +
            '                           // fetch contract ABI by a known address.\n' +
            '                           // Default: https://api.etherscan.io/.\n' +
            '}\nwhere\n' +
            'ContractJSON {\n' +
            '    name: string; // Contract string ID. Can contain spaces.\n' +
            '    address: string; // Contract address. Implementation address for proxies.\n' +
            '    proxy?: string; // (optional) Proxy contract address.\n' +
            '    abi?: string; // (optional) Path or URL to the contract JSON ABI. If\n' +
            '                  // omitted, it will be retrieved from Etherscan by address.\n' +
            '    events?: string[] | boolean; // One or multiple contract events to be\n' +
            '                                 // indexed. true indexes all events defined in\n' +
            '                                 // the ABI; false indexes none. Default: false\n' +
            '    functions?: string[] | boolean; // One or multiple contract functions to be\n' +
            '                                    // indexed. true indexes all functions\n' +
            '                                    // defined in the ABI; false indexes none.\n' +
            '                                    // Default: false\n' +
            '    range?: { // Range of blocks to index. Default: all from the genesis.\n' +
            '        from?: number;\n' +
            '        to?: number;\n' +
            '    };\n' +
            '}\n\n' +
            'Example:\n' +
            '{\n' +
            '    "archive": "eth-mainnet",\n' +
            '    "contracts": [\n' +
            '        {\n' +
            '            "name": "Gravatar",\n' +
            '            "address": "0x2E645469f354BB4F5c8a05B3b30A929361cf77eC",\n' +
            '            "events": true,\n' +
            '            "functions": true\n' +
            '        }\n' +
            '    ],\n' +
            '    "etherscanApi": "https://api.etherscan.io"\n' +
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
            let config = yaml.parse(content, {schema: 'json'})
            validate(config, CONFIG_SCHEMA)
            return config
        case '.json':
            return read(file, CONFIG_SCHEMA)
        default:
            throw new Error(`Unsupported file extension "${path.extname(file)}"`)
    }
}
