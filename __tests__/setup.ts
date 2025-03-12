import request from 'supertest'
import { Application } from 'express'
import { configureApp } from '../src/app'
import dotenv from 'dotenv'
import path from 'path'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'

dotenv.config({ path: path.resolve(__dirname, '../.env.test') })

let container: StartedPostgreSqlContainer
let databaseUrl: string
let app: Application

export const seedDatabase = async () => {
  try {
    const response = await request(app).post('/api/test/seed').send({})

    return response.body.data
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

export const clearDatabase = async () => {
  try {
    await request(app).post('/api/test/clear').send({})
  } catch (error) {
    console.error('Error clearing database:', error)
    throw error
  }
}

beforeAll(async () => {
  container = await new PostgreSqlContainer().start()

  databaseUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`

  process.env.DATABASE_URL = databaseUrl
  app = configureApp(3000)
}, 60000)

afterAll(async () => {
  if (container) {
    await container.stop()
  }
}, 60000)

export { app }
