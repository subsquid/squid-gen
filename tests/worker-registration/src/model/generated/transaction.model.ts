import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Transaction {
    constructor(props?: Partial<Transaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: true})
    blockNumber!: number | undefined | null

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    blockTimestamp!: Date

    @Index_()
    @Column_("text", {nullable: false})
    hash!: string

    @Index_()
    @Column_("text", {nullable: true})
    to!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    from!: string | undefined | null

    @Index_()
    @Column_("int4", {nullable: true})
    status!: number | undefined | null
}
