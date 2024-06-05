import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AllocatedCUs: event("0xa27699da150f8443c51cda13c28a1cbfb78ee3b4055de58197e770999fc23fbd", {"gateway": indexed(p.address), "peerId": p.bytes, "workerIds": p.array(p.uint256), "shares": p.array(p.uint256)}),
    AutoextensionDisabled: event("0x17679fc77cdf7f6b7d2af4cb30497f3e81088fde6fdb20ca48d31372bc2af006", {"gatewayOperator": indexed(p.address), "lockEnd": p.uint128}),
    AutoextensionEnabled: event("0xeff5f78e20f1cd92a537c3cdbaeaea11ad293aace5d7262ed93f2f33b42a828f", {"gatewayOperator": indexed(p.address)}),
    AverageBlockTimeChanged: event("0x46a9c997a4d81c1f992b7ec20e34dfc97c0c67a86dc24f9ff1525718690bead3", {"newBlockTime": p.uint256}),
    DefaultStrategyChanged: event("0x84e184ce3e506721b995db9e77ad7527e97c83dd04bf98f5830508602bf837ad", {"strategy": indexed(p.address)}),
    GatewayAddressChanged: event("0x39cabfa8731da74e931aee9746250190051269d4d0c37ec9fb8276a32b1f6601", {"gatewayOperator": indexed(p.address), "peerId": p.bytes, "newAddress": p.address}),
    Initialized: event("0xc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d2", {"version": p.uint64}),
    ManaChanged: event("0xd48c454cdec818a86733db9fd6353a7b80d423e6a189ecac47703f9b5fa0801b", {"newCuPerSQD": p.uint256}),
    MaxGatewaysPerClusterChanged: event("0xf092d674fd06aab53c483be96eb202422ad493b452660e05adfe7f02aca08c1f", {"newAmount": p.uint256}),
    MetadataChanged: event("0x512a85d60acb1212e9e49cec8fc20daed3ed43977be6a8db77faf2c859e79e7f", {"gatewayOperator": indexed(p.address), "peerId": p.bytes, "metadata": p.string}),
    MinStakeChanged: event("0x4d36185d86b6e1aefe7e3c72bbcf2329ea433a9dc2655a34739abe83a7ce74a0", {"newAmount": p.uint256}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", {"account": p.address}),
    Registered: event("0xb9c7babb56df9f2da4a30811a6c778e4e68af88b72712d56cf62c5516e20e199", {"gatewayOperator": indexed(p.address), "id": indexed(p.bytes32), "peerId": p.bytes}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Staked: event("0x85362f63fb0e3050a216decb3a7297e2aaff6cbf5b22583c073118d7efc8a47b", {"gatewayOperator": indexed(p.address), "amount": p.uint256, "lockStart": p.uint128, "lockEnd": p.uint128, "computationUnits": p.uint256}),
    StrategyAllowed: event("0x4e8e4980b101f6a8ebe870c7cf3767fb92422ef0c95a65b5cd750f9fce3c26e0", {"strategy": indexed(p.address), "isAllowed": p.bool}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", {"account": p.address}),
    Unregistered: event("0xa133cd95a0c9cb4f8272f86cd3bb48ba2bf54f982e60bba1618e1286925eddec", {"gatewayOperator": indexed(p.address), "peerId": p.bytes}),
    Unstaked: event("0x0f5bb82176feb1b5e747e28471aa92156a04d9f3ab9f45f28e2d704232b93f75", {"gatewayOperator": indexed(p.address), "amount": p.uint256}),
    UsedStrategyChanged: event("0xe31c0bedb29ec4df4a7c3d8d8c0e4ad6bf3648906837d5400d61a94410c5e5bb", {"gatewayOperator": indexed(p.address), "strategy": p.address}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    PAUSER_ROLE: viewFun("0xe63ab1e9", {}, p.bytes32),
    addStake: fun("0xeb4f16b5", {"amount": p.uint256}, ),
    allocateComputationUnits: fun("0xb785a2e6", {"workerIds": p.array(p.uint256), "cus": p.array(p.uint256)}, ),
    averageBlockTime: viewFun("0x233dedf1", {}, p.uint256),
    canUnstake: viewFun("0x85f4498b", {"operator": p.address}, p.bool),
    computationUnitsAmount: viewFun("0x1c0fa1c8", {"amount": p.uint256, "durationBlocks": p.uint256}, p.uint256),
    computationUnitsAvailable: viewFun("0x44d4bea8", {"peerId": p.bytes}, p.uint256),
    defaultStrategy: viewFun("0xfac5bb9b", {}, p.address),
    disableAutoExtension: fun("0xe6c7f21b", {}, ),
    enableAutoExtension: fun("0x13f117f2", {}, ),
    gatewayByAddress: viewFun("0x429773fb", {"_0": p.address}, p.bytes32),
    getActiveGateways: viewFun("0x01a99356", {"pageNumber": p.uint256, "perPage": p.uint256}, p.array(p.bytes)),
    getActiveGatewaysCount: viewFun("0xd87113e5", {}, p.uint256),
    getCluster: viewFun("0x585a6a6d", {"peerId": p.bytes}, p.array(p.bytes)),
    getGateway: viewFun("0xdcefedaf", {"peerId": p.bytes}, p.struct({"operator": p.address, "ownAddress": p.address, "peerId": p.bytes, "metadata": p.string})),
    getMetadata: viewFun("0x75734be8", {"peerId": p.bytes}, p.string),
    getMyGateways: viewFun("0x2c17a07f", {"operator": p.address}, p.array(p.bytes)),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    getStake: viewFun("0x7a766460", {"operator": p.address}, p.struct({"amount": p.uint256, "lockStart": p.uint128, "lockEnd": p.uint128, "duration": p.uint128, "autoExtension": p.bool, "oldCUs": p.uint256})),
    getUsedStrategy: viewFun("0x94f3c725", {"peerId": p.bytes}, p.address),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    initialize: fun("0x485cc955", {"_token": p.address, "_router": p.address}, ),
    isStrategyAllowed: viewFun("0x67c1def9", {"strategy": p.address}, p.bool),
    mana: viewFun("0xbdb001a7", {}, p.uint256),
    maxGatewaysPerCluster: viewFun("0xbc9c0e62", {}, p.uint256),
    minStake: viewFun("0x375b3c0a", {}, p.uint256),
    pause: fun("0x8456cb59", {}, ),
    paused: viewFun("0x5c975abb", {}, p.bool),
    "register(bytes)": fun("0x82fbdc9c", {"peerId": p.bytes}, ),
    "register(bytes,string,address)": fun("0x876ab349", {"peerId": p.bytes, "metadata": p.string, "gatewayAddress": p.address}, ),
    "register(bytes,string)": fun("0x92255fbf", {"peerId": p.bytes, "metadata": p.string}, ),
    "register(bytes[],string[],address[])": fun("0xb1a7e279", {"peerId": p.array(p.bytes), "metadata": p.array(p.string), "gatewayAddress": p.array(p.address)}, ),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    router: viewFun("0xf887ea40", {}, p.address),
    setAverageBlockTime: fun("0x3736d853", {"_newAverageBlockTime": p.uint256}, ),
    setGatewayAddress: fun("0xdacfab0d", {"peerId": p.bytes, "newAddress": p.address}, ),
    setIsStrategyAllowed: fun("0x017a02c3", {"strategy": p.address, "isAllowed": p.bool, "isDefault": p.bool}, ),
    setMana: fun("0x0def8b8a", {"_newMana": p.uint256}, ),
    setMaxGatewaysPerCluster: fun("0x3abcf38c", {"_maxGatewaysPerCluster": p.uint256}, ),
    setMetadata: fun("0x0fe9fb66", {"peerId": p.bytes, "metadata": p.string}, ),
    setMinStake: fun("0x8c80fd90", {"_minStake": p.uint256}, ),
    "stake(uint256,uint128)": fun("0x7acfc9e2", {"amount": p.uint256, "durationBlocks": p.uint128}, ),
    "stake(uint256,uint128,bool)": fun("0xe3fa31ed", {"amount": p.uint256, "durationBlocks": p.uint128, "withAutoExtension": p.bool}, ),
    staked: viewFun("0x98807d84", {"operator": p.address}, p.uint256),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    token: viewFun("0xfc0c546a", {}, p.address),
    unpause: fun("0x3f4ba83a", {}, ),
    "unregister(bytes)": fun("0x27d6c032", {"peerId": p.bytes}, ),
    "unregister(bytes[])": fun("0xf586857a", {"peerId": p.array(p.bytes)}, ),
    unstake: fun("0x2def6620", {}, ),
    useStrategy: fun("0xb8050a5d", {"strategy": p.address}, ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    PAUSER_ROLE() {
        return this.eth_call(functions.PAUSER_ROLE, {})
    }

    averageBlockTime() {
        return this.eth_call(functions.averageBlockTime, {})
    }

    canUnstake(operator: CanUnstakeParams["operator"]) {
        return this.eth_call(functions.canUnstake, {operator})
    }

    computationUnitsAmount(amount: ComputationUnitsAmountParams["amount"], durationBlocks: ComputationUnitsAmountParams["durationBlocks"]) {
        return this.eth_call(functions.computationUnitsAmount, {amount, durationBlocks})
    }

    computationUnitsAvailable(peerId: ComputationUnitsAvailableParams["peerId"]) {
        return this.eth_call(functions.computationUnitsAvailable, {peerId})
    }

    defaultStrategy() {
        return this.eth_call(functions.defaultStrategy, {})
    }

    gatewayByAddress(_0: GatewayByAddressParams["_0"]) {
        return this.eth_call(functions.gatewayByAddress, {_0})
    }

    getActiveGateways(pageNumber: GetActiveGatewaysParams["pageNumber"], perPage: GetActiveGatewaysParams["perPage"]) {
        return this.eth_call(functions.getActiveGateways, {pageNumber, perPage})
    }

    getActiveGatewaysCount() {
        return this.eth_call(functions.getActiveGatewaysCount, {})
    }

    getCluster(peerId: GetClusterParams["peerId"]) {
        return this.eth_call(functions.getCluster, {peerId})
    }

    getGateway(peerId: GetGatewayParams["peerId"]) {
        return this.eth_call(functions.getGateway, {peerId})
    }

    getMetadata(peerId: GetMetadataParams["peerId"]) {
        return this.eth_call(functions.getMetadata, {peerId})
    }

    getMyGateways(operator: GetMyGatewaysParams["operator"]) {
        return this.eth_call(functions.getMyGateways, {operator})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    getStake(operator: GetStakeParams["operator"]) {
        return this.eth_call(functions.getStake, {operator})
    }

    getUsedStrategy(peerId: GetUsedStrategyParams["peerId"]) {
        return this.eth_call(functions.getUsedStrategy, {peerId})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isStrategyAllowed(strategy: IsStrategyAllowedParams["strategy"]) {
        return this.eth_call(functions.isStrategyAllowed, {strategy})
    }

    mana() {
        return this.eth_call(functions.mana, {})
    }

    maxGatewaysPerCluster() {
        return this.eth_call(functions.maxGatewaysPerCluster, {})
    }

    minStake() {
        return this.eth_call(functions.minStake, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    router() {
        return this.eth_call(functions.router, {})
    }

    staked(operator: StakedParams["operator"]) {
        return this.eth_call(functions.staked, {operator})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    token() {
        return this.eth_call(functions.token, {})
    }
}

/// Event types
export type AllocatedCUsEventArgs = EParams<typeof events.AllocatedCUs>
export type AutoextensionDisabledEventArgs = EParams<typeof events.AutoextensionDisabled>
export type AutoextensionEnabledEventArgs = EParams<typeof events.AutoextensionEnabled>
export type AverageBlockTimeChangedEventArgs = EParams<typeof events.AverageBlockTimeChanged>
export type DefaultStrategyChangedEventArgs = EParams<typeof events.DefaultStrategyChanged>
export type GatewayAddressChangedEventArgs = EParams<typeof events.GatewayAddressChanged>
export type InitializedEventArgs = EParams<typeof events.Initialized>
export type ManaChangedEventArgs = EParams<typeof events.ManaChanged>
export type MaxGatewaysPerClusterChangedEventArgs = EParams<typeof events.MaxGatewaysPerClusterChanged>
export type MetadataChangedEventArgs = EParams<typeof events.MetadataChanged>
export type MinStakeChangedEventArgs = EParams<typeof events.MinStakeChanged>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RegisteredEventArgs = EParams<typeof events.Registered>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type StakedEventArgs = EParams<typeof events.Staked>
export type StrategyAllowedEventArgs = EParams<typeof events.StrategyAllowed>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type UnregisteredEventArgs = EParams<typeof events.Unregistered>
export type UnstakedEventArgs = EParams<typeof events.Unstaked>
export type UsedStrategyChangedEventArgs = EParams<typeof events.UsedStrategyChanged>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type AddStakeParams = FunctionArguments<typeof functions.addStake>
export type AddStakeReturn = FunctionReturn<typeof functions.addStake>

export type AllocateComputationUnitsParams = FunctionArguments<typeof functions.allocateComputationUnits>
export type AllocateComputationUnitsReturn = FunctionReturn<typeof functions.allocateComputationUnits>

export type AverageBlockTimeParams = FunctionArguments<typeof functions.averageBlockTime>
export type AverageBlockTimeReturn = FunctionReturn<typeof functions.averageBlockTime>

export type CanUnstakeParams = FunctionArguments<typeof functions.canUnstake>
export type CanUnstakeReturn = FunctionReturn<typeof functions.canUnstake>

export type ComputationUnitsAmountParams = FunctionArguments<typeof functions.computationUnitsAmount>
export type ComputationUnitsAmountReturn = FunctionReturn<typeof functions.computationUnitsAmount>

export type ComputationUnitsAvailableParams = FunctionArguments<typeof functions.computationUnitsAvailable>
export type ComputationUnitsAvailableReturn = FunctionReturn<typeof functions.computationUnitsAvailable>

export type DefaultStrategyParams = FunctionArguments<typeof functions.defaultStrategy>
export type DefaultStrategyReturn = FunctionReturn<typeof functions.defaultStrategy>

export type DisableAutoExtensionParams = FunctionArguments<typeof functions.disableAutoExtension>
export type DisableAutoExtensionReturn = FunctionReturn<typeof functions.disableAutoExtension>

export type EnableAutoExtensionParams = FunctionArguments<typeof functions.enableAutoExtension>
export type EnableAutoExtensionReturn = FunctionReturn<typeof functions.enableAutoExtension>

export type GatewayByAddressParams = FunctionArguments<typeof functions.gatewayByAddress>
export type GatewayByAddressReturn = FunctionReturn<typeof functions.gatewayByAddress>

export type GetActiveGatewaysParams = FunctionArguments<typeof functions.getActiveGateways>
export type GetActiveGatewaysReturn = FunctionReturn<typeof functions.getActiveGateways>

export type GetActiveGatewaysCountParams = FunctionArguments<typeof functions.getActiveGatewaysCount>
export type GetActiveGatewaysCountReturn = FunctionReturn<typeof functions.getActiveGatewaysCount>

export type GetClusterParams = FunctionArguments<typeof functions.getCluster>
export type GetClusterReturn = FunctionReturn<typeof functions.getCluster>

export type GetGatewayParams = FunctionArguments<typeof functions.getGateway>
export type GetGatewayReturn = FunctionReturn<typeof functions.getGateway>

export type GetMetadataParams = FunctionArguments<typeof functions.getMetadata>
export type GetMetadataReturn = FunctionReturn<typeof functions.getMetadata>

export type GetMyGatewaysParams = FunctionArguments<typeof functions.getMyGateways>
export type GetMyGatewaysReturn = FunctionReturn<typeof functions.getMyGateways>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetStakeParams = FunctionArguments<typeof functions.getStake>
export type GetStakeReturn = FunctionReturn<typeof functions.getStake>

export type GetUsedStrategyParams = FunctionArguments<typeof functions.getUsedStrategy>
export type GetUsedStrategyReturn = FunctionReturn<typeof functions.getUsedStrategy>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type InitializeParams = FunctionArguments<typeof functions.initialize>
export type InitializeReturn = FunctionReturn<typeof functions.initialize>

export type IsStrategyAllowedParams = FunctionArguments<typeof functions.isStrategyAllowed>
export type IsStrategyAllowedReturn = FunctionReturn<typeof functions.isStrategyAllowed>

export type ManaParams = FunctionArguments<typeof functions.mana>
export type ManaReturn = FunctionReturn<typeof functions.mana>

export type MaxGatewaysPerClusterParams = FunctionArguments<typeof functions.maxGatewaysPerCluster>
export type MaxGatewaysPerClusterReturn = FunctionReturn<typeof functions.maxGatewaysPerCluster>

export type MinStakeParams = FunctionArguments<typeof functions.minStake>
export type MinStakeReturn = FunctionReturn<typeof functions.minStake>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RegisterParams_0 = FunctionArguments<typeof functions["register(bytes)"]>
export type RegisterReturn_0 = FunctionReturn<typeof functions["register(bytes)"]>

export type RegisterParams_1 = FunctionArguments<typeof functions["register(bytes,string,address)"]>
export type RegisterReturn_1 = FunctionReturn<typeof functions["register(bytes,string,address)"]>

export type RegisterParams_2 = FunctionArguments<typeof functions["register(bytes,string)"]>
export type RegisterReturn_2 = FunctionReturn<typeof functions["register(bytes,string)"]>

export type RegisterParams_3 = FunctionArguments<typeof functions["register(bytes[],string[],address[])"]>
export type RegisterReturn_3 = FunctionReturn<typeof functions["register(bytes[],string[],address[])"]>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RouterParams = FunctionArguments<typeof functions.router>
export type RouterReturn = FunctionReturn<typeof functions.router>

export type SetAverageBlockTimeParams = FunctionArguments<typeof functions.setAverageBlockTime>
export type SetAverageBlockTimeReturn = FunctionReturn<typeof functions.setAverageBlockTime>

export type SetGatewayAddressParams = FunctionArguments<typeof functions.setGatewayAddress>
export type SetGatewayAddressReturn = FunctionReturn<typeof functions.setGatewayAddress>

export type SetIsStrategyAllowedParams = FunctionArguments<typeof functions.setIsStrategyAllowed>
export type SetIsStrategyAllowedReturn = FunctionReturn<typeof functions.setIsStrategyAllowed>

export type SetManaParams = FunctionArguments<typeof functions.setMana>
export type SetManaReturn = FunctionReturn<typeof functions.setMana>

export type SetMaxGatewaysPerClusterParams = FunctionArguments<typeof functions.setMaxGatewaysPerCluster>
export type SetMaxGatewaysPerClusterReturn = FunctionReturn<typeof functions.setMaxGatewaysPerCluster>

export type SetMetadataParams = FunctionArguments<typeof functions.setMetadata>
export type SetMetadataReturn = FunctionReturn<typeof functions.setMetadata>

export type SetMinStakeParams = FunctionArguments<typeof functions.setMinStake>
export type SetMinStakeReturn = FunctionReturn<typeof functions.setMinStake>

export type StakeParams_0 = FunctionArguments<typeof functions["stake(uint256,uint128)"]>
export type StakeReturn_0 = FunctionReturn<typeof functions["stake(uint256,uint128)"]>

export type StakeParams_1 = FunctionArguments<typeof functions["stake(uint256,uint128,bool)"]>
export type StakeReturn_1 = FunctionReturn<typeof functions["stake(uint256,uint128,bool)"]>

export type StakedParams = FunctionArguments<typeof functions.staked>
export type StakedReturn = FunctionReturn<typeof functions.staked>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TokenParams = FunctionArguments<typeof functions.token>
export type TokenReturn = FunctionReturn<typeof functions.token>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UnregisterParams_0 = FunctionArguments<typeof functions["unregister(bytes)"]>
export type UnregisterReturn_0 = FunctionReturn<typeof functions["unregister(bytes)"]>

export type UnregisterParams_1 = FunctionArguments<typeof functions["unregister(bytes[])"]>
export type UnregisterReturn_1 = FunctionReturn<typeof functions["unregister(bytes[])"]>

export type UnstakeParams = FunctionArguments<typeof functions.unstake>
export type UnstakeReturn = FunctionReturn<typeof functions.unstake>

export type UseStrategyParams = FunctionArguments<typeof functions.useStrategy>
export type UseStrategyReturn = FunctionReturn<typeof functions.useStrategy>

