import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Index_(["blockNumber", "blockTimestamp", "transactionHash", "contract", "functionName", "functionSuccess"], {unique: false})
@Entity_()
export class FactoryFunctionCreateGravatar {
    constructor(props?: Partial<FactoryFunctionCreateGravatar>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

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
    functionName!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    functionValue!: bigint

    @Index_()
    @Column_("bool", {nullable: false})
    functionSuccess!: boolean

    @Column_("text", {nullable: false})
    imageUrl0!: string

    @Column_("text", {nullable: false})
    owner!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    param00!: bigint

    @Column_("text", {nullable: false})
    param01!: string

    @Column_("text", {nullable: false})
    displayName0!: string

    @Column_("text", {nullable: false})
    displayName1!: string

    @Column_("text", {nullable: false})
    imageUrl1!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    param02!: bigint
}
