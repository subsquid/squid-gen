module.exports = class Data1757523619068 {
    name = 'Data1757523619068'

    async up(db) {
        await db.query(`CREATE TABLE "tokens_usdc_transfer" ("id" character varying NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, CONSTRAINT "PK_05e56311bab6e0d481049798ba6" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "tokens_sqd_transfer" ("id" character varying NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, CONSTRAINT "PK_6df96fdcb74fa749317264a75c2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "aave_pool_main_liquidation_call" ("id" character varying NOT NULL, "block" integer NOT NULL, "txn_hash" text NOT NULL, "collateral_asset" text NOT NULL, "debt_asset" text NOT NULL, "user" text NOT NULL, "debt_to_cover" numeric NOT NULL, "liquidated_collateral_amount" numeric NOT NULL, "liquidator" text NOT NULL, "receive_a_token" boolean, CONSTRAINT "PK_d5dc4ca45e8d1992750727b4882" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "tokens_usdc_transfer"`)
        await db.query(`DROP TABLE "tokens_sqd_transfer"`)
        await db.query(`DROP TABLE "aave_pool_main_liquidation_call"`)
    }
}
