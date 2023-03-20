import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Index_(["blockNumber", "blockTimestamp", "transactionHash", "contract", "eventName"], {unique: false})
@Entity_()
export class FactoryEventUpdatedGravatar {
    constructor(props?: Partial<FactoryEventUpdatedGravatar>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    id0!: string

    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    blockTimestamp!: Date

    @Index_()
    @Column_("text", {nullable: false})
    transactionHash!: string

    @Index_()
    @Column_("text", {nullable: false})
    contract!: string

    @Index_()
    @Column_("text", {nullable: false})
    eventName!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    id1!: bigint

    @Column_("text", {nullable: false})
    owner0!: string

    @Column_("text", {nullable: false})
    displayName0!: string

    @Column_("text", {nullable: false})
    imageUrl0!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    id2!: bigint

    @Column_("text", {nullable: false})
    owner1!: string

    @Column_("text", {nullable: false})
    displayName1!: string

    @Column_("text", {nullable: false})
    imageUrl1!: string
}
