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
        success: Column(Types.Boolean(), {nullable: true}),
    }
)

export let GravatarEventNewGravatar = new Table(
    'gravatar_event_new_gravatar.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        id0: Column(Types.Decimal(38), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        displayName: Column(Types.String(), {nullable: false}),
        imageUrl: Column(Types.String(), {nullable: false}),
    }
)

export let GravatarEventUpdatedGravatar = new Table(
    'gravatar_event_updated_gravatar.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        eventName: Column(Types.String(), {nullable: false}),
        id0: Column(Types.Decimal(38), {nullable: false}),
        owner: Column(Types.String(), {nullable: false}),
        displayName: Column(Types.String(), {nullable: false}),
        imageUrl: Column(Types.String(), {nullable: false}),
    }
)

export let GravatarFunctionUpdateGravatarImage = new Table(
    'gravatar_function_update_gravatar_image.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        imageUrl: Column(Types.String(), {nullable: false}),
    }
)

export let GravatarFunctionSetMythicalGravatar = new Table(
    'gravatar_function_set_mythical_gravatar.parquet',
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

export let GravatarFunctionUpdateGravatarName = new Table(
    'gravatar_function_update_gravatar_name.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        displayName: Column(Types.String(), {nullable: false}),
    }
)

export let GravatarFunctionCreateGravatar = new Table(
    'gravatar_function_create_gravatar.parquet',
     {
        id: Column(Types.String(), {nullable: false}),
        blockNumber: Column(Types.Int64(), {nullable: false}),
        blockTimestamp: Column(Types.Timestamp(), {nullable: false}),
        transactionHash: Column(Types.String(), {nullable: false}),
        contract: Column(Types.String(), {nullable: false}),
        functionName: Column(Types.String(), {nullable: false}),
        functionValue: Column(Types.Decimal(38), {nullable: true}),
        functionSuccess: Column(Types.Boolean(), {nullable: true}),
        displayName: Column(Types.String(), {nullable: false}),
        imageUrl: Column(Types.String(), {nullable: false}),
    }
)
