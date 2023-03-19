import {program} from 'commander'

program.command('abi', 'generates code for a squid from contract abi')
program.command('config', 'generates code for a squid based on provided config')
program.parse()
