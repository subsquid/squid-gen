import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    NewGravatar: event("0x9ab3aefb2ba6dc12910ac1bce4692cf5c3c0d06cff16327c64a3ef78228b130b", {"id": p.uint256, "owner": p.address, "displayName": p.string, "imageUrl": p.string}),
    UpdatedGravatar: event("0x76571b7a897a1509c641587568218a290018fbdc8b9a724f17b77ff0eec22c0c", {"id": p.uint256, "owner": p.address, "displayName": p.string, "imageUrl": p.string}),
}

export const functions = {
    updateGravatarImage: fun("0x0081d6e5", {"_imageUrl": p.string}, ),
    setMythicalGravatar: fun("0x1d4f2c6d", {}, ),
    getGravatar: viewFun("0x359c1f72", {"owner": p.address}, {"_0": p.string, "_1": p.string}),
    gravatarToOwner: viewFun("0x88d0d391", {"_0": p.uint256}, p.address),
    ownerToGravatar: viewFun("0xa5ac3634", {"_0": p.address}, p.uint256),
    updateGravatarName: fun("0xb18588fb", {"_displayName": p.string}, ),
    createGravatar: fun("0xcdb3344a", {"_displayName": p.string, "_imageUrl": p.string}, ),
    gravatars: viewFun("0xd5ce24ed", {"_0": p.uint256}, {"owner": p.address, "displayName": p.string, "imageUrl": p.string}),
}

export class Contract extends ContractBase {

    getGravatar(owner: GetGravatarParams["owner"]) {
        return this.eth_call(functions.getGravatar, {owner})
    }

    gravatarToOwner(_0: GravatarToOwnerParams["_0"]) {
        return this.eth_call(functions.gravatarToOwner, {_0})
    }

    ownerToGravatar(_0: OwnerToGravatarParams["_0"]) {
        return this.eth_call(functions.ownerToGravatar, {_0})
    }

    gravatars(_0: GravatarsParams["_0"]) {
        return this.eth_call(functions.gravatars, {_0})
    }
}

/// Event types
export type NewGravatarEventArgs = EParams<typeof events.NewGravatar>
export type UpdatedGravatarEventArgs = EParams<typeof events.UpdatedGravatar>

/// Function types
export type UpdateGravatarImageParams = FunctionArguments<typeof functions.updateGravatarImage>
export type UpdateGravatarImageReturn = FunctionReturn<typeof functions.updateGravatarImage>

export type SetMythicalGravatarParams = FunctionArguments<typeof functions.setMythicalGravatar>
export type SetMythicalGravatarReturn = FunctionReturn<typeof functions.setMythicalGravatar>

export type GetGravatarParams = FunctionArguments<typeof functions.getGravatar>
export type GetGravatarReturn = FunctionReturn<typeof functions.getGravatar>

export type GravatarToOwnerParams = FunctionArguments<typeof functions.gravatarToOwner>
export type GravatarToOwnerReturn = FunctionReturn<typeof functions.gravatarToOwner>

export type OwnerToGravatarParams = FunctionArguments<typeof functions.ownerToGravatar>
export type OwnerToGravatarReturn = FunctionReturn<typeof functions.ownerToGravatar>

export type UpdateGravatarNameParams = FunctionArguments<typeof functions.updateGravatarName>
export type UpdateGravatarNameReturn = FunctionReturn<typeof functions.updateGravatarName>

export type CreateGravatarParams = FunctionArguments<typeof functions.createGravatar>
export type CreateGravatarReturn = FunctionReturn<typeof functions.createGravatar>

export type GravatarsParams = FunctionArguments<typeof functions.gravatars>
export type GravatarsReturn = FunctionReturn<typeof functions.gravatars>

