import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import dotenv from 'dotenv'
import path from 'path'
import { configureApp } from '../src/app'
import { getPrismaClient } from '../src/lib/prisma'
import { setupDatabase } from './db-setup'
import { Express } from 'express'

dotenv.config({ path: path.resolve(__dirname, '../.env.test') })

// Global variables to be shared between setup and teardown
declare global {
  // eslint-disable-next-line no-var
  var __POSTGRES_CONTAINER__: StartedPostgreSqlContainer
  // eslint-disable-next-line no-var
  var __DATABASE_URL__: string
  // eslint-disable-next-line no-var
  var __TEST_APP__: Express
}

export default async function globalSetup() {
  console.log('Starting global setup...')

  const container = await new PostgreSqlContainer().start()
  global.__POSTGRES_CONTAINER__ = container

  const databaseUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`
  global.__DATABASE_URL__ = databaseUrl

  process.env.DATABASE_URL = databaseUrl

  await setupDatabase(databaseUrl)

  const prisma = getPrismaClient(databaseUrl)

  const app = configureApp({ prisma, port: 3000 })
  global.__TEST_APP__ = app

  console.log('Global setup completed')
}
