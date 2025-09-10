# Squid with tests

This squid captures `Transfer(address,address,uint256)` events emitted by the contract at `env.CONTRACT_ADDRESS` ([USDC token contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) by default). It keeps up with network updates [in real time](https://docs.sqd.ai/sdk/resources/unfinalized-blocks/). Balances of individual accounts are computed and kept up to date.

The handler function for batches of `Transfer`s lives in a [separate module](/src/batchHandlers/transfer.ts) and has a [test](/src/batchHandlers/transfer.int.test.ts). The test can run locally or [as a GitHub Action](/.github/workflows/run_tests.yml).

Dependencies: Node.js v20 or newer, Docker.

## Quickstart

```bash
git clone https://github.com/subsquid-labs/squid-with-tests
cd squid-with-tests
docker compose up -d
npm run build
npx squid-typeorm-migration apply
node -r dotenv/config lib/main.js
```
then in a separate terminal
```bash
npx squid-graphql-server
```

A GraphiQL playground will be available at [localhost:4350/graphql](http://localhost:4350/graphql).

## Testing

Enter the project folder and make sure that the database is up:
```bash
docker compose up -d
```
then run
```bash
npm test
```