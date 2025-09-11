import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class TokensTransfer {
    constructor(props?: Partial<TokensTransfer>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    network!: string

    @StringColumn_({nullable: false})
    instanceAddress!: string

    @IntColumn_({nullable: false})
    block!: number

    @StringColumn_({nullable: false})
    txnHash!: string

    @StringColumn_({nullable: false})
    from!: string

    @StringColumn_({nullable: false})
    to!: string

    @BigIntColumn_({nullable: false})
    value!: bigint
}
