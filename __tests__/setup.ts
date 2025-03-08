import { PostgresContainer, StartedPostgresContainer } from './testcontainers';
import { createPrismaClient } from '../src/lib/prisma';
import request from 'supertest';
import { Application } from 'express';
import { configureApp } from '../src/app';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

const execAsync = promisify(exec);

// Global variables for test environment
let container: StartedPostgresContainer;
let databaseUrl: string;
let prisma: PrismaClient;
let app: Application;

// Helper function to seed the database for tests
export const seedDatabase = async () => {
  try {
    const response = await request(app)
      .post('/api/test/seed')
      .send({});
    
    return response.body.data;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Helper function to clear the database after tests
export const clearDatabase = async () => {
  try {
    await request(app)
      .post('/api/test/clear')
      .send({});
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// Global setup and teardown
beforeAll(async () => {
  // Start PostgreSQL container
  container = await new PostgresContainer().start();

  // Get the connection URL
  databaseUrl = container.getConnectionUrl();
  
  // Set the DATABASE_URL environment variable for Prisma
  process.env.DATABASE_URL = databaseUrl;
  
  // Generate Prisma client with the test database URL
  await execAsync('npx prisma generate');
  
  // Create a new Prisma client with the test database URL
  prisma = createPrismaClient(databaseUrl);
  
  // Push the schema to the test database
  await execAsync('npx prisma db push --skip-generate');
  
  // Configure the Express app for testing
  app = configureApp(3000);
  
  // Replace the global fetch function for supertest
  global.fetch = request(app) as any;
}, 60000); // Increase timeout for container startup

afterAll(async () => {
  await prisma.$disconnect();
  
  if (container) {
    await container.stop();
  }
}, 60000); // Increase timeout for container shutdown

export { app, prisma }; 
