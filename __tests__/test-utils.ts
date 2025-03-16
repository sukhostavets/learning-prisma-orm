import request from 'supertest'

export const getApp = () => {
  if (!global.__TEST_APP__) {
    throw new Error('Test app not initialized. Make sure global setup has run.')
  }
  return global.__TEST_APP__
}

export const getDatabaseUrl = () => {
  if (!global.__DATABASE_URL__) {
    throw new Error('Database URL not set. Make sure global setup has run.')
  }
  return global.__DATABASE_URL__
}

export const seedDatabase = async () => {
  try {
    const response = await request(getApp()).post('/api/test/seed').send({})
    return response.body.data
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}

export const clearDatabase = async () => {
  try {
    await request(getApp()).post('/api/test/clear').send({})
  } catch (error) {
    console.error('Error clearing database:', error)
    throw error
  }
}
