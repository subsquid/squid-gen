import assert from 'assert'
import {ethers, logger} from 'ethers'
import {getType as getTsType} from '@subsquid/evm-typegen/lib/util/types'
import {SquidFragment, SquidFragmentParam, TypegenOutput} from './interfaces'
import {toEntityName, toFieldName} from './naming'

const STATIC_ENTITY_FIELDS: ReadonlyArray<string> = ['id', 'name', 'block', 'transaction']

export class FragmentsParser {
    private events: Record<string, SquidFragment>
    private functions: Record<string, SquidFragment>

    constructor(private typegenFile: TypegenOutput) {
        this.events = this.parseFragments(typegenFile, 'event')
        this.functions = this.parseFragments(typegenFile, 'function')
    }

    parseFragments(typegenFile: TypegenOutput, kind: 'event' | 'function') {
        let res: Record<string, SquidFragment> = {}

        let items = kind === 'event' ? typegenFile.events : typegenFile.functions

        let overloads: Record<string, number> = {}

        for (let name in items) {
            let fragment = items[name].fragment

            let entityName = toEntityName(fragment.name)
            while (true) {
                let overloadIndex = overloads[entityName]
                if (overloadIndex == null) {
                    let ols = typegenFile.abi.fragments.filter(
                        (f) => f.type === fragment.type && toEntityName(f.name) === entityName
                    )
                    if (ols.length > 1) {
                        overloadIndex = overloads[entityName] = 0
                    } else if (ols.length > 0 && entityName !== toEntityName(fragment.name)) {
                        overloadIndex = overloads[entityName] = 0
                    } else {
                        break
                    }
                }
                overloads[entityName] += 1
                entityName += overloadIndex
            }
            entityName += kind === 'event' ? `Event` : `Function`

            let params: SquidFragmentParam[] = []
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
                        if (ols.length > 1 || STATIC_ENTITY_FIELDS.indexOf(fieldName) > -1) {
                            overlapIndex = overlaps[fieldName] = 0
                        } else if (
                            ols.length > 0 &&
                            (input.name == null || fieldName !== toFieldName(input.name))
                        ) {
                            overlapIndex = overlaps[fieldName] = 0
                        } else {
                            break
                        }
                    }
                    overlaps[fieldName] += 1
                    fieldName += overlapIndex
                }

                params.push({
                    name: fieldName,
                    indexed: input.indexed,
                    schemaType: getGqlType(input),
                    required: true,
                })
            }

            res[name] = {
                name,
                entityName,
                params,
            }
        }

        return res
    }

    getEvents(names: string[]) {
        if (names.includes(`*`)) {
            names = Object.keys(this.events)
        }

        let res: SquidFragment[] = []
        for (let name of names) {
            let fragment = this.events[name]
            assert(fragment != null, `Event "${name}" doesn't exist for this contract`)

            res.push(fragment)
        }

        return res
    }

    getFunctions(names: string[]) {
        if (names.includes(`*`)) {
            names = Object.keys(this.functions)
        }

        let res: SquidFragment[] = []
        for (let name of names) {
            let fragment = this.functions[name]
            assert(fragment != null, `Function "${name}" doesn't exist for this contract`)

            if (this.typegenFile.functions[name].fragment.stateMutability === 'view') {
                logger.warn(`Readonly function "${name}" skipped`)
                continue
            }

            res.push(fragment)
        }

        return res
    }
}

function getGqlType(param: ethers.utils.ParamType): string {
    let tsType = getTsType(param)
    return tsTypeToGqlType(tsType)
}

function tsTypeToGqlType(type: string): string {
    if (type === 'string') {
        return 'String'
    } else if (type === 'boolean') {
        return 'Boolean'
    } else if (type === 'number') {
        return 'Int'
    } else if (type === 'ethers.BigNumber') {
        return 'BigInt'
    } else {
        return 'JSON'
    }
}
