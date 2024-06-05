import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class WorkerRegistrationEventWorkerRegistered {
    constructor(props?: Partial<WorkerRegistrationEventWorkerRegistered>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
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

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    workerId!: bigint

    @Column_("text", {nullable: false})
    peerId!: string

    @Index_()
    @Column_("text", {nullable: false})
    registrar!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    registeredAt!: bigint

    @Column_("text", {nullable: false})
    metadata!: string
}
