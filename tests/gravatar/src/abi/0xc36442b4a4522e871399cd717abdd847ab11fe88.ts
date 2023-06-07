import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './0xc36442b4a4522e871399cd717abdd847ab11fe88.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    Approval: new LogEvent<([owner: string, approved: string, tokenId: bigint] & {owner: string, approved: string, tokenId: bigint})>(
        abi, '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
    ),
    ApprovalForAll: new LogEvent<([owner: string, operator: string, approved: boolean] & {owner: string, operator: string, approved: boolean})>(
        abi, '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31'
    ),
    Collect: new LogEvent<([tokenId: bigint, recipient: string, amount0: bigint, amount1: bigint] & {tokenId: bigint, recipient: string, amount0: bigint, amount1: bigint})>(
        abi, '0x40d0efd1a53d60ecbf40971b9daf7dc90178c3aadc7aab1765632738fa8b8f01'
    ),
    DecreaseLiquidity: new LogEvent<([tokenId: bigint, liquidity: bigint, amount0: bigint, amount1: bigint] & {tokenId: bigint, liquidity: bigint, amount0: bigint, amount1: bigint})>(
        abi, '0x26f6a048ee9138f2c0ce266f322cb99228e8d619ae2bff30c67f8dcf9d2377b4'
    ),
    IncreaseLiquidity: new LogEvent<([tokenId: bigint, liquidity: bigint, amount0: bigint, amount1: bigint] & {tokenId: bigint, liquidity: bigint, amount0: bigint, amount1: bigint})>(
        abi, '0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f'
    ),
    Transfer: new LogEvent<([from: string, to: string, tokenId: bigint] & {from: string, to: string, tokenId: bigint})>(
        abi, '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ),
}

export const functions = {
    DOMAIN_SEPARATOR: new Func<[], {}, string>(
        abi, '0x3644e515'
    ),
    PERMIT_TYPEHASH: new Func<[], {}, string>(
        abi, '0x30adf81f'
    ),
    WETH9: new Func<[], {}, string>(
        abi, '0x4aa4a4fc'
    ),
    approve: new Func<[to: string, tokenId: bigint], {to: string, tokenId: bigint}, []>(
        abi, '0x095ea7b3'
    ),
    balanceOf: new Func<[owner: string], {owner: string}, bigint>(
        abi, '0x70a08231'
    ),
    baseURI: new Func<[], {}, string>(
        abi, '0x6c0360eb'
    ),
    burn: new Func<[tokenId: bigint], {tokenId: bigint}, []>(
        abi, '0x42966c68'
    ),
    collect: new Func<[params: ([tokenId: bigint, recipient: string, amount0Max: bigint, amount1Max: bigint] & {tokenId: bigint, recipient: string, amount0Max: bigint, amount1Max: bigint})], {params: ([tokenId: bigint, recipient: string, amount0Max: bigint, amount1Max: bigint] & {tokenId: bigint, recipient: string, amount0Max: bigint, amount1Max: bigint})}, ([amount0: bigint, amount1: bigint] & {amount0: bigint, amount1: bigint})>(
        abi, '0xfc6f7865'
    ),
    createAndInitializePoolIfNecessary: new Func<[token0: string, token1: string, fee: number, sqrtPriceX96: bigint], {token0: string, token1: string, fee: number, sqrtPriceX96: bigint}, string>(
        abi, '0x13ead562'
    ),
    decreaseLiquidity: new Func<[params: ([tokenId: bigint, liquidity: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint] & {tokenId: bigint, liquidity: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint})], {params: ([tokenId: bigint, liquidity: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint] & {tokenId: bigint, liquidity: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint})}, ([amount0: bigint, amount1: bigint] & {amount0: bigint, amount1: bigint})>(
        abi, '0x0c49ccbe'
    ),
    factory: new Func<[], {}, string>(
        abi, '0xc45a0155'
    ),
    getApproved: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x081812fc'
    ),
    increaseLiquidity: new Func<[params: ([tokenId: bigint, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint] & {tokenId: bigint, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint})], {params: ([tokenId: bigint, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint] & {tokenId: bigint, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, deadline: bigint})}, ([liquidity: bigint, amount0: bigint, amount1: bigint] & {liquidity: bigint, amount0: bigint, amount1: bigint})>(
        abi, '0x219f5d17'
    ),
    isApprovedForAll: new Func<[owner: string, operator: string], {owner: string, operator: string}, boolean>(
        abi, '0xe985e9c5'
    ),
    mint: new Func<[params: ([token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, recipient: string, deadline: bigint] & {token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, recipient: string, deadline: bigint})], {params: ([token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, recipient: string, deadline: bigint] & {token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, amount0Desired: bigint, amount1Desired: bigint, amount0Min: bigint, amount1Min: bigint, recipient: string, deadline: bigint})}, ([tokenId: bigint, liquidity: bigint, amount0: bigint, amount1: bigint] & {tokenId: bigint, liquidity: bigint, amount0: bigint, amount1: bigint})>(
        abi, '0x88316456'
    ),
    multicall: new Func<[data: Array<string>], {data: Array<string>}, Array<string>>(
        abi, '0xac9650d8'
    ),
    name: new Func<[], {}, string>(
        abi, '0x06fdde03'
    ),
    ownerOf: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0x6352211e'
    ),
    permit: new Func<[spender: string, tokenId: bigint, deadline: bigint, v: number, r: string, s: string], {spender: string, tokenId: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0x7ac2ff7b'
    ),
    positions: new Func<[tokenId: bigint], {tokenId: bigint}, ([nonce: bigint, operator: string, token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint] & {nonce: bigint, operator: string, token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint})>(
        abi, '0x99fbab88'
    ),
    refundETH: new Func<[], {}, []>(
        abi, '0x12210e8a'
    ),
    'safeTransferFrom(address,address,uint256)': new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x42842e0e'
    ),
    'safeTransferFrom(address,address,uint256,bytes)': new Func<[from: string, to: string, tokenId: bigint, _data: string], {from: string, to: string, tokenId: bigint, _data: string}, []>(
        abi, '0xb88d4fde'
    ),
    selfPermit: new Func<[token: string, value: bigint, deadline: bigint, v: number, r: string, s: string], {token: string, value: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0xf3995c67'
    ),
    selfPermitAllowed: new Func<[token: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string], {token: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string}, []>(
        abi, '0x4659a494'
    ),
    selfPermitAllowedIfNecessary: new Func<[token: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string], {token: string, nonce: bigint, expiry: bigint, v: number, r: string, s: string}, []>(
        abi, '0xa4a78f0c'
    ),
    selfPermitIfNecessary: new Func<[token: string, value: bigint, deadline: bigint, v: number, r: string, s: string], {token: string, value: bigint, deadline: bigint, v: number, r: string, s: string}, []>(
        abi, '0xc2e3140a'
    ),
    setApprovalForAll: new Func<[operator: string, approved: boolean], {operator: string, approved: boolean}, []>(
        abi, '0xa22cb465'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    sweepToken: new Func<[token: string, amountMinimum: bigint, recipient: string], {token: string, amountMinimum: bigint, recipient: string}, []>(
        abi, '0xdf2ab5bb'
    ),
    symbol: new Func<[], {}, string>(
        abi, '0x95d89b41'
    ),
    tokenByIndex: new Func<[index: bigint], {index: bigint}, bigint>(
        abi, '0x4f6ccce7'
    ),
    tokenOfOwnerByIndex: new Func<[owner: string, index: bigint], {owner: string, index: bigint}, bigint>(
        abi, '0x2f745c59'
    ),
    tokenURI: new Func<[tokenId: bigint], {tokenId: bigint}, string>(
        abi, '0xc87b56dd'
    ),
    totalSupply: new Func<[], {}, bigint>(
        abi, '0x18160ddd'
    ),
    transferFrom: new Func<[from: string, to: string, tokenId: bigint], {from: string, to: string, tokenId: bigint}, []>(
        abi, '0x23b872dd'
    ),
    uniswapV3MintCallback: new Func<[amount0Owed: bigint, amount1Owed: bigint, data: string], {amount0Owed: bigint, amount1Owed: bigint, data: string}, []>(
        abi, '0xd3487997'
    ),
    unwrapWETH9: new Func<[amountMinimum: bigint, recipient: string], {amountMinimum: bigint, recipient: string}, []>(
        abi, '0x49404b7c'
    ),
}

export class Contract extends ContractBase {

    DOMAIN_SEPARATOR(): Promise<string> {
        return this.eth_call(functions.DOMAIN_SEPARATOR, [])
    }

    PERMIT_TYPEHASH(): Promise<string> {
        return this.eth_call(functions.PERMIT_TYPEHASH, [])
    }

    WETH9(): Promise<string> {
        return this.eth_call(functions.WETH9, [])
    }

    balanceOf(owner: string): Promise<bigint> {
        return this.eth_call(functions.balanceOf, [owner])
    }

    baseURI(): Promise<string> {
        return this.eth_call(functions.baseURI, [])
    }

    factory(): Promise<string> {
        return this.eth_call(functions.factory, [])
    }

    getApproved(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.getApproved, [tokenId])
    }

    isApprovedForAll(owner: string, operator: string): Promise<boolean> {
        return this.eth_call(functions.isApprovedForAll, [owner, operator])
    }

    name(): Promise<string> {
        return this.eth_call(functions.name, [])
    }

    ownerOf(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.ownerOf, [tokenId])
    }

    positions(tokenId: bigint): Promise<([nonce: bigint, operator: string, token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint] & {nonce: bigint, operator: string, token0: string, token1: string, fee: number, tickLower: number, tickUpper: number, liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint})> {
        return this.eth_call(functions.positions, [tokenId])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    symbol(): Promise<string> {
        return this.eth_call(functions.symbol, [])
    }

    tokenByIndex(index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenByIndex, [index])
    }

    tokenOfOwnerByIndex(owner: string, index: bigint): Promise<bigint> {
        return this.eth_call(functions.tokenOfOwnerByIndex, [owner, index])
    }

    tokenURI(tokenId: bigint): Promise<string> {
        return this.eth_call(functions.tokenURI, [tokenId])
    }

    totalSupply(): Promise<bigint> {
        return this.eth_call(functions.totalSupply, [])
    }
}
