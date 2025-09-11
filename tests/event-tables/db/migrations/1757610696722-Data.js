module.exports = class Data1757610696722 {
    name = 'Data1757610696722'

    async up(db) {
        await db.query(`CREATE TABLE "tokens_transfer" ("id" character varying NOT NULL, "network" text NOT NULL, "instance_address" text NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, CONSTRAINT "PK_5e959005d89b51e90a758733c14" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "aave_pool_liquidation_call" ("id" character varying NOT NULL, "network" text NOT NULL, "instance_address" text NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, "collateral_asset" text NOT NULL, "debt_asset" text NOT NULL, "user" text NOT NULL, "debt_to_cover" numeric NOT NULL, "liquidated_collateral_amount" numeric NOT NULL, "liquidator" text NOT NULL, "receive_a_token" boolean, CONSTRAINT "PK_381384f288fcd8cbc31cf6a1275" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "tokens_transfer"`)
        await db.query(`DROP TABLE "aave_pool_liquidation_call"`)
    }
}
