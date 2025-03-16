import request from 'supertest'
import { seedDatabase, clearDatabase, getApp } from '../test-utils'

describe('User API Endpoints', () => {
  let testData: any

  // Seed the database before tests
  beforeAll(async () => {
    testData = await seedDatabase()
  })

  // Clear the database after tests
  afterAll(async () => {
    await clearDatabase()
  })

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(getApp()).get('/api/users')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBe(3)

      // Check if the response contains the expected users
      const emails = response.body.map((user: any) => user.email)
      expect(emails).toContain('john@example.com')
      expect(emails).toContain('jane@example.com')
      expect(emails).toContain('bob@example.com')
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return a user by ID', async () => {
      const userId = testData.users[0].id
      const response = await request(getApp()).get(`/api/users/${userId}`)

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(userId)
      expect(response.body.email).toBe('john@example.com')
      expect(response.body.name).toBe('John Doe')
      // Password should not be returned
      expect(response.body.password).toBeUndefined()
    })

    it('should return 404 for non-existent user', async () => {
      const response = await request(getApp()).get('/api/users/9999')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('User not found')
    })
  })

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      }

      const response = await request(getApp()).post('/api/users').send(newUser)

      expect(response.status).toBe(201)
      expect(response.body.email).toBe(newUser.email)
      expect(response.body.name).toBe(newUser.name)
      // Password should not be returned
      expect(response.body.password).toBeUndefined()
    })

    it('should return 409 for duplicate email', async () => {
      const duplicateUser = {
        email: 'john@example.com', // Already exists
        name: 'Duplicate User',
        password: 'password123',
      }

      const response = await request(getApp()).post('/api/users').send(duplicateUser)

      expect(response.status).toBe(409)
      expect(response.body.error).toBe('Email already exists')
    })
  })

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const userId = testData.users[1].id
      const updatedData = {
        name: 'Updated Name',
      }

      const response = await request(getApp()).put(`/api/users/${userId}`).send(updatedData)

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(userId)
      expect(response.body.name).toBe(updatedData.name)
      expect(response.body.email).toBe('jane@example.com') // Unchanged
    })

    it('should return 404 for non-existent user', async () => {
      const response = await request(getApp()).put('/api/users/9999').send({ name: 'Updated Name' })

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('User not found')
    })
  })

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const userId = testData.users[2].id

      const response = await request(getApp()).delete(`/api/users/${userId}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('User deleted successfully')

      // Verify the user is deleted
      const getResponse = await request(getApp()).get(`/api/users/${userId}`)
      expect(getResponse.status).toBe(404)
    })

    it('should return 404 for non-existent user', async () => {
      const response = await request(getApp()).delete('/api/users/9999')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('User not found')
    })
  })
})
