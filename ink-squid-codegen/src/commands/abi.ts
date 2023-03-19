import {program} from 'commander'
import {runProgram} from '@subsquid/util-internal'
import {Config} from '../schema'
import {generateSquid} from '../squid'
import {nat} from '@subsquid/util-internal-commander'

program
    .addHelpText(
        'before',
        'Generates code for a squid indexing given ink events. Run within a folder cloned from https://github.com/subsquid/squid-wasm-abi-template.\n'
    )
    .requiredOption(`--address <contract>`, `Contract address.`)
    .option(`--name <name>`, `Contract name.`)
    .requiredOption(
        `--archive <alias|url>`,
        `Source Squid Archive for a network that supports 'contracts' pallet. Can be a URL or an alias defined by @subsquid/archive-registry.`
    )
    .requiredOption(
        `--abi <path>`, `Path to the contract JSON ABI.`
    )
    .option(
        `-e, --event <name...>`,
        `One or multiple contract events to be indexed. '*' indexes all events defined in the ABI.`,
        []
    )
    .option(`--from <block>`, `(optional) Start indexing from the given block.`, nat)
    .option(`--to <block>`, `(optional) End indexing on the given block.`, nat)
    .addHelpText(
        'after',
        "\nExample:\nsquid-gen-abi --address 0x5207202c27b646ceeb294ce516d4334edafbd771f869215cb070ba51dd7e2c72 --archive shibuya --abi ./abi/erc20.json --event '*'"
    )

runProgram(async function () {
    program.parse()

    let opts = program.opts() as {
        address: string
        name?: string
        archive: string
        abi: string
        event: string[]
        from?: string
        to?: string
    }

    let config: Config = {
        archive: opts.archive,
        contracts: [
            {
                name: opts.name,
                address: opts.address,
                abi: opts.abi,
                events: opts.event.includes('*') ? true : opts.event,
                range: {
                    from: Number(opts.from),
                    to: Number(opts.to),
                },
            },
        ],
    }

    await generateSquid(config)
})
