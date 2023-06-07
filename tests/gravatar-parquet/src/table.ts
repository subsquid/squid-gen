import {Table, Types, Column} from '@subsquid/file-store-parquet'

export let Block = new Table(
    'block.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        number: Column(Types.Int64(), {nullable: false}),
        timestamp: Column(Types.Timestamp(), {nullable: false}),
    }
)

export let Transaction = new Table(
    'transaction.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: true}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        hash: Column(Types.String(), {nullable: false}),
        to: Column(Types.String(), {nullable: true}),
        from: Column(Types.String(), {nullable: true}),
        status: Column(Types.Int64(), {nullable: true}),
    }
)

export let UsdtEventTransfer = new Table(
    'usdt_event_transfer.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        from: Column(Types.String(), {nullable: false}),
        to: Column(Types.String(), {nullable: false}),
        value: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionDeprecate = new Table(
    'usdt_function_deprecate.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        upgradedAddress: Column(Types.String(), {nullable: false}),
    }
)

export let UsdtFunctionApprove = new Table(
    'usdt_function_approve.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        spender: Column(Types.String(), {nullable: false}),
        value: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionAddBlackList = new Table(
    'usdt_function_add_black_list.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        evilUser: Column(Types.String(), {nullable: false}),
    }
)

export let UsdtFunctionTransferFrom = new Table(
    'usdt_function_transfer_from.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        from: Column(Types.String(), {nullable: false}),
        to: Column(Types.String(), {nullable: false}),
        value: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionUnpause = new Table(
    'usdt_function_unpause.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
    }
)

export let UsdtFunctionPause = new Table(
    'usdt_function_pause.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
    }
)

export let UsdtFunctionTransfer = new Table(
    'usdt_function_transfer.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        to: Column(Types.String(), {nullable: false}),
        value: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionSetParams = new Table(
    'usdt_function_set_params.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        newBasisPoints: Column(Types.Decimal(38), {nullable: false}),
        newMaxFee: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionIssue = new Table(
    'usdt_function_issue.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        amount: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionRedeem = new Table(
    'usdt_function_redeem.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        amount: Column(Types.Decimal(38), {nullable: false}),
    }
)

export let UsdtFunctionRemoveBlackList = new Table(
    'usdt_function_remove_black_list.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        clearedUser: Column(Types.String(), {nullable: false}),
    }
)

export let UsdtFunctionTransferOwnership = new Table(
    'usdt_function_transfer_ownership.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        newOwner: Column(Types.String(), {nullable: false}),
    }
)

export let UsdtFunctionDestroyBlackFunds = new Table(
    'usdt_function_destroy_black_funds.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        blackListedUser: Column(Types.String(), {nullable: false}),
    }
)
