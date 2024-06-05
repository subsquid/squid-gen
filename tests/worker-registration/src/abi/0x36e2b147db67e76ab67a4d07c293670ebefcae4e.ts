import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ExcessiveBondReturned: event("0x54ebfb2891f338e31ae38698df33da34d539ea1aa57fa0a1900a3b9d845d4f54", {"workerId": indexed(p.uint256), "amount": p.uint256}),
    MetadataUpdated: event("0x459157ba24c7ab9878b165ef465fa6ae2ab42bcd8445f576be378768b0c47309", {"workerId": indexed(p.uint256), "metadata": p.string}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", {"account": p.address}),
    RoleAdminChanged: event("0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff", {"role": indexed(p.bytes32), "previousAdminRole": indexed(p.bytes32), "newAdminRole": indexed(p.bytes32)}),
    RoleGranted: event("0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    RoleRevoked: event("0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b", {"role": indexed(p.bytes32), "account": indexed(p.address), "sender": indexed(p.address)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", {"account": p.address}),
    WorkerDeregistered: event("0x4a7ca6c9178181481ac5c6e9ed0965213ae489c4aaf53323bd5e1f318a9d77c3", {"workerId": indexed(p.uint256), "account": indexed(p.address), "deregistedAt": p.uint256}),
    WorkerRegistered: event("0xa7a0c37f13c7accf7ec7771a2531c06e0183a37162a8e036039b241eab784156", {"workerId": indexed(p.uint256), "peerId": p.bytes, "registrar": indexed(p.address), "registeredAt": p.uint256, "metadata": p.string}),
    WorkerWithdrawn: event("0xb6ee3a0ef8982f0f296a13a075fe56e5fd8c1bc2282a3c5b54f12d514ed7a956", {"workerId": indexed(p.uint256), "account": indexed(p.address)}),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: viewFun("0xa217fddf", {}, p.bytes32),
    PAUSER_ROLE: viewFun("0xe63ab1e9", {}, p.bytes32),
    SQD: viewFun("0x6aa54679", {}, p.address),
    bondAmount: viewFun("0x80f323a7", {}, p.uint256),
    deregister: fun("0xb4d0a564", {"peerId": p.bytes}, ),
    epochLength: viewFun("0x57d775f8", {}, p.uint128),
    getActiveWorkerCount: viewFun("0x3e556827", {}, p.uint256),
    getActiveWorkerIds: viewFun("0xc0a0d6cf", {}, p.array(p.uint256)),
    getActiveWorkers: viewFun("0x393bc3d9", {}, p.array(p.struct({"creator": p.address, "peerId": p.bytes, "bond": p.uint256, "registeredAt": p.uint128, "deregisteredAt": p.uint128, "metadata": p.string}))),
    getAllWorkersCount: viewFun("0xf905aaf6", {}, p.uint256),
    getMetadata: viewFun("0x75734be8", {"peerId": p.bytes}, p.string),
    getOwnedWorkers: viewFun("0x75b80f11", {"owner": p.address}, p.array(p.uint256)),
    getRoleAdmin: viewFun("0x248a9ca3", {"role": p.bytes32}, p.bytes32),
    getWorker: viewFun("0xa39dbdb9", {"workerId": p.uint256}, p.struct({"creator": p.address, "peerId": p.bytes, "bond": p.uint256, "registeredAt": p.uint128, "deregisteredAt": p.uint128, "metadata": p.string})),
    grantRole: fun("0x2f2ff15d", {"role": p.bytes32, "account": p.address}, ),
    hasRole: viewFun("0x91d14854", {"role": p.bytes32, "account": p.address}, p.bool),
    isWorkerActive: viewFun("0xb036482f", {"workerId": p.uint256}, p.bool),
    lockPeriod: viewFun("0x3fd8b02f", {}, p.uint128),
    nextEpoch: viewFun("0xaea0e78b", {}, p.uint128),
    nextWorkerId: viewFun("0xc84a4922", {}, p.uint256),
    pause: fun("0x8456cb59", {}, ),
    paused: viewFun("0x5c975abb", {}, p.bool),
    "register(bytes)": fun("0x82fbdc9c", {"peerId": p.bytes}, ),
    "register(bytes,string)": fun("0x92255fbf", {"peerId": p.bytes, "metadata": p.string}, ),
    renounceRole: fun("0x36568abe", {"role": p.bytes32, "callerConfirmation": p.address}, ),
    returnExcessiveBond: fun("0xe4e33692", {"peerId": p.bytes}, ),
    revokeRole: fun("0xd547741f", {"role": p.bytes32, "account": p.address}, ),
    router: viewFun("0xf887ea40", {}, p.address),
    supportsInterface: viewFun("0x01ffc9a7", {"interfaceId": p.bytes4}, p.bool),
    unpause: fun("0x3f4ba83a", {}, ),
    updateMetadata: fun("0xddc651c3", {"peerId": p.bytes, "metadata": p.string}, ),
    withdraw: fun("0x0968f264", {"peerId": p.bytes}, ),
    workerIds: viewFun("0x7a39cb2b", {"peerId": p.bytes}, p.uint256),
    workers: viewFun("0xf1a22dc2", {"_0": p.uint256}, {"creator": p.address, "peerId": p.bytes, "bond": p.uint256, "registeredAt": p.uint128, "deregisteredAt": p.uint128, "metadata": p.string}),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE() {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, {})
    }

    PAUSER_ROLE() {
        return this.eth_call(functions.PAUSER_ROLE, {})
    }

    SQD() {
        return this.eth_call(functions.SQD, {})
    }

    bondAmount() {
        return this.eth_call(functions.bondAmount, {})
    }

    epochLength() {
        return this.eth_call(functions.epochLength, {})
    }

    getActiveWorkerCount() {
        return this.eth_call(functions.getActiveWorkerCount, {})
    }

    getActiveWorkerIds() {
        return this.eth_call(functions.getActiveWorkerIds, {})
    }

    getActiveWorkers() {
        return this.eth_call(functions.getActiveWorkers, {})
    }

    getAllWorkersCount() {
        return this.eth_call(functions.getAllWorkersCount, {})
    }

    getMetadata(peerId: GetMetadataParams["peerId"]) {
        return this.eth_call(functions.getMetadata, {peerId})
    }

    getOwnedWorkers(owner: GetOwnedWorkersParams["owner"]) {
        return this.eth_call(functions.getOwnedWorkers, {owner})
    }

    getRoleAdmin(role: GetRoleAdminParams["role"]) {
        return this.eth_call(functions.getRoleAdmin, {role})
    }

    getWorker(workerId: GetWorkerParams["workerId"]) {
        return this.eth_call(functions.getWorker, {workerId})
    }

    hasRole(role: HasRoleParams["role"], account: HasRoleParams["account"]) {
        return this.eth_call(functions.hasRole, {role, account})
    }

    isWorkerActive(workerId: IsWorkerActiveParams["workerId"]) {
        return this.eth_call(functions.isWorkerActive, {workerId})
    }

    lockPeriod() {
        return this.eth_call(functions.lockPeriod, {})
    }

    nextEpoch() {
        return this.eth_call(functions.nextEpoch, {})
    }

    nextWorkerId() {
        return this.eth_call(functions.nextWorkerId, {})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    router() {
        return this.eth_call(functions.router, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    workerIds(peerId: WorkerIdsParams["peerId"]) {
        return this.eth_call(functions.workerIds, {peerId})
    }

    workers(_0: WorkersParams["_0"]) {
        return this.eth_call(functions.workers, {_0})
    }
}

/// Event types
export type ExcessiveBondReturnedEventArgs = EParams<typeof events.ExcessiveBondReturned>
export type MetadataUpdatedEventArgs = EParams<typeof events.MetadataUpdated>
export type PausedEventArgs = EParams<typeof events.Paused>
export type RoleAdminChangedEventArgs = EParams<typeof events.RoleAdminChanged>
export type RoleGrantedEventArgs = EParams<typeof events.RoleGranted>
export type RoleRevokedEventArgs = EParams<typeof events.RoleRevoked>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type WorkerDeregisteredEventArgs = EParams<typeof events.WorkerDeregistered>
export type WorkerRegisteredEventArgs = EParams<typeof events.WorkerRegistered>
export type WorkerWithdrawnEventArgs = EParams<typeof events.WorkerWithdrawn>

/// Function types
export type DEFAULT_ADMIN_ROLEParams = FunctionArguments<typeof functions.DEFAULT_ADMIN_ROLE>
export type DEFAULT_ADMIN_ROLEReturn = FunctionReturn<typeof functions.DEFAULT_ADMIN_ROLE>

export type PAUSER_ROLEParams = FunctionArguments<typeof functions.PAUSER_ROLE>
export type PAUSER_ROLEReturn = FunctionReturn<typeof functions.PAUSER_ROLE>

export type SQDParams = FunctionArguments<typeof functions.SQD>
export type SQDReturn = FunctionReturn<typeof functions.SQD>

export type BondAmountParams = FunctionArguments<typeof functions.bondAmount>
export type BondAmountReturn = FunctionReturn<typeof functions.bondAmount>

export type DeregisterParams = FunctionArguments<typeof functions.deregister>
export type DeregisterReturn = FunctionReturn<typeof functions.deregister>

export type EpochLengthParams = FunctionArguments<typeof functions.epochLength>
export type EpochLengthReturn = FunctionReturn<typeof functions.epochLength>

export type GetActiveWorkerCountParams = FunctionArguments<typeof functions.getActiveWorkerCount>
export type GetActiveWorkerCountReturn = FunctionReturn<typeof functions.getActiveWorkerCount>

export type GetActiveWorkerIdsParams = FunctionArguments<typeof functions.getActiveWorkerIds>
export type GetActiveWorkerIdsReturn = FunctionReturn<typeof functions.getActiveWorkerIds>

export type GetActiveWorkersParams = FunctionArguments<typeof functions.getActiveWorkers>
export type GetActiveWorkersReturn = FunctionReturn<typeof functions.getActiveWorkers>

export type GetAllWorkersCountParams = FunctionArguments<typeof functions.getAllWorkersCount>
export type GetAllWorkersCountReturn = FunctionReturn<typeof functions.getAllWorkersCount>

export type GetMetadataParams = FunctionArguments<typeof functions.getMetadata>
export type GetMetadataReturn = FunctionReturn<typeof functions.getMetadata>

export type GetOwnedWorkersParams = FunctionArguments<typeof functions.getOwnedWorkers>
export type GetOwnedWorkersReturn = FunctionReturn<typeof functions.getOwnedWorkers>

export type GetRoleAdminParams = FunctionArguments<typeof functions.getRoleAdmin>
export type GetRoleAdminReturn = FunctionReturn<typeof functions.getRoleAdmin>

export type GetWorkerParams = FunctionArguments<typeof functions.getWorker>
export type GetWorkerReturn = FunctionReturn<typeof functions.getWorker>

export type GrantRoleParams = FunctionArguments<typeof functions.grantRole>
export type GrantRoleReturn = FunctionReturn<typeof functions.grantRole>

export type HasRoleParams = FunctionArguments<typeof functions.hasRole>
export type HasRoleReturn = FunctionReturn<typeof functions.hasRole>

export type IsWorkerActiveParams = FunctionArguments<typeof functions.isWorkerActive>
export type IsWorkerActiveReturn = FunctionReturn<typeof functions.isWorkerActive>

export type LockPeriodParams = FunctionArguments<typeof functions.lockPeriod>
export type LockPeriodReturn = FunctionReturn<typeof functions.lockPeriod>

export type NextEpochParams = FunctionArguments<typeof functions.nextEpoch>
export type NextEpochReturn = FunctionReturn<typeof functions.nextEpoch>

export type NextWorkerIdParams = FunctionArguments<typeof functions.nextWorkerId>
export type NextWorkerIdReturn = FunctionReturn<typeof functions.nextWorkerId>

export type PauseParams = FunctionArguments<typeof functions.pause>
export type PauseReturn = FunctionReturn<typeof functions.pause>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type RegisterParams_0 = FunctionArguments<typeof functions["register(bytes)"]>
export type RegisterReturn_0 = FunctionReturn<typeof functions["register(bytes)"]>

export type RegisterParams_1 = FunctionArguments<typeof functions["register(bytes,string)"]>
export type RegisterReturn_1 = FunctionReturn<typeof functions["register(bytes,string)"]>

export type RenounceRoleParams = FunctionArguments<typeof functions.renounceRole>
export type RenounceRoleReturn = FunctionReturn<typeof functions.renounceRole>

export type ReturnExcessiveBondParams = FunctionArguments<typeof functions.returnExcessiveBond>
export type ReturnExcessiveBondReturn = FunctionReturn<typeof functions.returnExcessiveBond>

export type RevokeRoleParams = FunctionArguments<typeof functions.revokeRole>
export type RevokeRoleReturn = FunctionReturn<typeof functions.revokeRole>

export type RouterParams = FunctionArguments<typeof functions.router>
export type RouterReturn = FunctionReturn<typeof functions.router>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type UnpauseParams = FunctionArguments<typeof functions.unpause>
export type UnpauseReturn = FunctionReturn<typeof functions.unpause>

export type UpdateMetadataParams = FunctionArguments<typeof functions.updateMetadata>
export type UpdateMetadataReturn = FunctionReturn<typeof functions.updateMetadata>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type WorkerIdsParams = FunctionArguments<typeof functions.workerIds>
export type WorkerIdsReturn = FunctionReturn<typeof functions.workerIds>

export type WorkersParams = FunctionArguments<typeof functions.workers>
export type WorkersReturn = FunctionReturn<typeof functions.workers>

