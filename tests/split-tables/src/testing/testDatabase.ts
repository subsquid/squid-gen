import { Pool } from 'pg'
import { DataSource } from 'typeorm'
import { createOrmConfig } from '@subsquid/typeorm-config'

export interface TestDatabase {
  dataSource: DataSource
  cleanup: () => Promise<void>
  dbName: string
}

// Helper to generate a random DB name
export function randomDbName() {
  return `test_db_${Math.random().toString(36).substring(2, 10)}`
}

// Postgres connection config
export const PG_CONFIG = {
  host: 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
}

export async function setupTestDatabase() : Promise<TestDatabase> {
  const cwd = process.cwd()

  const dbName = randomDbName()
  const pool = new Pool({ ...PG_CONFIG, database: 'postgres' })
  await pool.query(`CREATE DATABASE "${dbName}"`)

  // Connect to the new test DB
  const testPool = new Pool({ ...PG_CONFIG, database: dbName })
  await testPool.end()

  // Getting some values from typeorm-store's default TypeORM config to match the behavior
  const defaultConfig = createOrmConfig({projectDir: cwd})

  // Set up TypeORM DataSource
  const dataSource = new DataSource({
    type: 'postgres',
    host: PG_CONFIG.host,
    port: PG_CONFIG.port,
    username: PG_CONFIG.user,
    password: PG_CONFIG.password,
    database: dbName,
    entities: [cwd + '/src/model/generated/*.model.{ts,js}'],
    migrations: [cwd + '/db/migrations/*.js'],
    synchronize: false,
    logging: false,
    namingStrategy: defaultConfig.namingStrategy
  })
  await dataSource.initialize()
  await dataSource.runMigrations()

  async function cleanup() {
    await dataSource.destroy()
    await pool.query(`DROP DATABASE IF EXISTS "${dbName}"`)
    await pool.end()
  }

  return { dataSource, cleanup, dbName }
}