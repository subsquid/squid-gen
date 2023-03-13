import {program} from 'commander'
import {runProgram} from '@subsquid/util-internal'
import {Config} from '../schema'
import {generateSquid} from '../squid'
import {nat} from '@subsquid/util-internal-commander'

program
    .addHelpText(
        'before',
        'Generates code for a squid indexing given EVM events and functions. Run within a folder cloned from https://github.com/subsquid/squid-abi-template.\n'
    )
    .requiredOption(`--address <contract>`, `Contract address. Implementation address for proxy contracts.`)
    .requiredOption(
        `--archive <alias|url>`,
        `Source Squid Archive for an EVM network. Can be a URL or an alias defined by @subsquid/archive-registry. See also https://docs.subsquid.io/ for the list of supported EVM networks.`
    )
    .option(
        `-e, --event <name...>`,
        `One or multiple contract events to be indexed. '*' indexes all events defined in the ABI.`,
        []
    )
    .option(
        `-f, --function <name...>`,
        `One or multiple contract functions to be indexed. '*' indexes all functions defined in the ABI.`,
        []
    )
    .option(
        `--abi <path>`,
        `(optional) Path or URL to the contract JSON ABI. If omitted, it will be retrieved from Etherscan by address.`
    )
    .option(`--proxy <contract>`, `(optional) Proxy contract address.`)
    .option(`--from <block>`, `(optional) Start indexing from the given block.`, nat)
    .option(`--to <block>`, `(optional) End indexing on the given block.`, nat)
    .option(
        `--etherscan-api <url>`,
        `(optional) Etherscan API-compatible endpoint to fetch contract ABI by a known address. Default: https://api.etherscan.io/.`
    )
    .addHelpText(
        'after',
        "\nExample:\nsquid-gen-abi --address 0x2E645469f354BB4F5c8a05B3b30A929361cf77eC --archive https://eth.archive.subsquid.io --event NewGravatar UpdatedGravatar --function '*' --from 6000000"
    )

runProgram(async function () {
    program.parse()

    let opts = program.opts() as {
        address: string
        archive: string
        proxy?: string
        abi?: string
        event: string[]
        function: string[]
        from?: string
        to?: string
        etherscanApi?: string
    }

    let config: Config = {
        archive: opts.archive,
        contracts: [
            {
                name: 'contract',
                address: opts.address,
                abi: opts.abi,
                events: opts.event.includes('*') ? true : opts.event,
                functions: opts.function.includes('*') ? true : opts.function,
                proxy: opts.proxy,
                range: {
                    from: Number(opts.from),
                    to: Number(opts.to),
                },
            },
        ],
        etherscanApi: opts.etherscanApi,
    }

    await generateSquid(config)
})
