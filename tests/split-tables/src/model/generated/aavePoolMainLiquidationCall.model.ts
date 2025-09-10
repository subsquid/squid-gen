import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AavePoolMainLiquidationCall {
    constructor(props?: Partial<AavePoolMainLiquidationCall>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @IntColumn_({nullable: false})
    block!: number

    @StringColumn_({nullable: false})
    txnHash!: string

    @StringColumn_({nullable: false})
    collateralAsset!: string

    @StringColumn_({nullable: false})
    debtAsset!: string

    @StringColumn_({nullable: false})
    user!: string

    @BigIntColumn_({nullable: false})
    debtToCover!: bigint

    @BigIntColumn_({nullable: false})
    liquidatedCollateralAmount!: bigint

    @StringColumn_({nullable: false})
    liquidator!: string

    @BooleanColumn_({nullable: true})
    receiveAToken!: boolean | undefined | null
}
