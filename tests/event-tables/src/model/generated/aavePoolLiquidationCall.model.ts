import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class AavePoolLiquidationCall {
    constructor(props?: Partial<AavePoolLiquidationCall>) {
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
