import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './0xdac17f958d2ee523a2206206994597c13d831ec7.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Issue: new LogEvent<([amount: bigint] & {amount: bigint})>(
        abi, '0xcb8241adb0c3fdb35b70c24ce35c5eb0c17af7431c99f827d44a445ca624176a'
    ),
    Redeem: new LogEvent<([amount: bigint] & {amount: bigint})>(
        abi, '0x702d5967f45f6513a38ffc42d6ba9bf230bd40e8f53b16363c7eb4fd2deb9a44'
    ),
    Deprecate: new LogEvent<([newAddress: string] & {newAddress: string})>(
        abi, '0xcc358699805e9a8b7f77b522628c7cb9abd07d9efb86b6fb616af1609036a99e'
    ),
    Params: new LogEvent<([feeBasisPoints: bigint, maxFee: bigint] & {feeBasisPoints: bigint, maxFee: bigint})>(
        abi, '0xb044a1e409eac5c48e5af22d4af52670dd1a99059537a78b31b48c6500a6354e'
    ),
    DestroyedBlackFunds: new LogEvent<([_blackListedUser: string, _balance: bigint] & {_blackListedUser: string, _balance: bigint})>(
        abi, '0x61e6e66b0d6339b2980aecc6ccc0039736791f0ccde9ed512e789a7fbdd698c6'
    ),
    AddedBlackList: new LogEvent<([_user: string] & {_user: string})>(
        abi, '0x42e160154868087d6bfdc0ca23d96a1c1cfa32f1b72ba9ba27b69b98a0d819dc'
    ),
    RemovedBlackList: new LogEvent<([_user: string] & {_user: string})>(
        abi, '0xd7e9ec6e6ecd65492dce6bf513cd6867560d49544421d0783ddf06e76c24470c'
    ),
    Approval: new LogEvent<([owner: string, spender: string, value: bigint] & {owner: string, spender: string, value: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    Transfer: new LogEvent<([from: string, to: string, value: bigint] & {from: string, to: string, value: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
    Pause: new LogEvent<[]>(
        abi, '0x6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff625'
    ),
    Unpause: new LogEvent<[]>(
        abi, '0x7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b33'
    ),
}

export const functions = {
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    deprecate: new Func<[_upgradedAddress: string], {_upgradedAddress: string}, []>(
        abi, '0x0753c30c'
    ),
    approve: new Func<[_spender: string, _value: bigint], {_spender: string, _value: bigint}, []>(
        abi, '0x095ea7b3'
    ),
    deprecated: new Func<[], {}, boolean>(
        abi, '0x0e136b19'
    ),
    addBlackList: new Func<[_evilUser: string], {_evilUser: string}, []>(
        abi, '0x0ecb93c0'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[_from: string, _to: string, _value: bigint], {_from: string, _to: string, _value: bigint}, []>(
        abi, '0x23b872dd'
    ),
    upgradedAddress: new Func<[], {}, string>(
        abi, '0x26976e3f'
    ),
    balances: new Func<[_: string], {}, bigint>(
        abi, '0x27e235e3'
    ),
    decimals: new Func<[], {}, bigint>(
        abi, '0x313ce567'
    ),
    maximumFee: new Func<[], {}, bigint>(
        abi, '0x35390714'
    ),
    _totalSupply: new Func<[], {}, bigint>(
        abi, '0x3eaaf86b'
    ),
    unpause: new Func<[], {}, []>(
        abi, '0x3f4ba83a'
    ),
    getBlackListStatus: new Func<[_maker: string], {_maker: string}, boolean>(
        abi, '0x59bf1abe'
    ),
    allowed: new Func<[_: string, _: string], {}, bigint>(
        abi, '0x5c658165'
    ),
    paused: new Func<[], {}, boolean>(
        abi, '0x5c975abb'
    ),
    balanceOf: new Func<[who: string], {who: string}, bigint>(
        abi, '0x70a08231'
    ),
    pause: new Func<[], {}, []>(
        abi, '0x8456cb59'
    ),
    getOwner: new Func<[], {}, string>(
        abi, '0x893d20e8'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    transfer: new Func<[_to: string, _value: bigint], {_to: string, _value: bigint}, []>(
        abi, '0xa9059cbb'
    ),
    setParams: new Func<[newBasisPoints: bigint, newMaxFee: bigint], {newBasisPoints: bigint, newMaxFee: bigint}, []>(
        abi, '0xc0324c77'
    ),
    issue: new Func<[amount: bigint], {amount: bigint}, []>(
        abi, '0xcc872b66'
    ),
    redeem: new Func<[amount: bigint], {amount: bigint}, []>(
        abi, '0xdb006a75'
    ),
    allowance: new Func<[_owner: string, _spender: string], {_owner: string, _spender: string}, bigint>(
        abi, '0xdd62ed3e'
    ),
    basisPointsRate: new Func<[], {}, bigint>(
        abi, '0xdd644f72'
    ),
    isBlackListed: new Func<[_: string], {}, boolean>(
        abi, '0xe47d6060'
    ),
    removeBlackList: new Func<[_clearedUser: string], {_clearedUser: string}, []>(
        abi, '0xe4997dc5'
    ),
    MAX_UINT: new Func<[], {}, bigint>(
        abi, '0xe5b5019a'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
    destroyBlackFunds: new Func<[_blackListedUser: string], {_blackListedUser: string}, []>(
        abi, '0xf3bdc228'
    ),
}

export class Contract extends ContractBase {

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    deprecated(): Promise<boolean> {
        return this.eth_call(functions.deprecated, [])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }

    upgradedAddress(): Promise<string> {
        return this.eth_call(functions.upgradedAddress, [])
    }

    balances(arg0: string): Promise<bigint> {
        return this.eth_call(functions.balances, [arg0])
    }

    decimals(): Promise<bigint> {
        return this.eth_call(functions.decimals, [])
    }

    maximumFee(): Promise<bigint> {
        return this.eth_call(functions.maximumFee, [])
    }

    _totalSupply(): Promise<bigint> {
        return this.eth_call(functions._totalSupply, [])
    }

    getBlackListStatus(_maker: string): Promise<boolean> {
        return this.eth_call(functions.getBlackListStatus, [_maker])
    }

    allowed(arg0: string, arg1: string): Promise<bigint> {
        return this.eth_call(functions.allowed, [arg0, arg1])
    }

    paused(): Promise<boolean> {
        return this.eth_call(functions.paused, [])
    }

    balanceOf(who: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [who])
    }

    getOwner(): Promise<string> {
        return this.eth_call(functions.getOwner, [])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    allowance(_owner: string, _spender: string): Promise<bigint> {
        return this.eth_call(functions.allowance, [_owner, _spender])
    }

    basisPointsRate(): Promise<bigint> {
        return this.eth_call(functions.basisPointsRate, [])
    }

    isBlackListed(arg0: string): Promise<boolean> {
        return this.eth_call(functions.isBlackListed, [arg0])
    }

    MAX_UINT(): Promise<bigint> {
        return this.eth_call(functions.MAX_UINT, [])
    }
}
