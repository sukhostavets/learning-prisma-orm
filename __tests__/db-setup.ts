import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

/**
 * Sets up the database for testing
 * This function ensures the database schema is up to date
 */
export async function setupDatabase(databaseUrl: string): Promise<void> {
  try {
    console.log('Setting up database schema...')

    // Get the absolute path to the Prisma schema
    const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma')

    // Use db push with force-reset to ensure clean database state
    const { stdout, stderr } = await execAsync(
      `DATABASE_URL="${databaseUrl}" npx prisma db push --schema=${schemaPath} --force-reset --accept-data-loss --skip-generate`,
      { shell: '/bin/bash' }
    )

    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)

    console.log('Database schema setup completed')

    // Create a new Prisma client with the test database URL to verify connection
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })

    try {
      // Connect to the database and verify tables exist
      await prisma.$connect()
      const tableCount = await prisma.$queryRaw`
        SELECT count(*) FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name IN ('users', 'posts', 'comments')
      `
      console.log('Database tables verified:', tableCount)
    } finally {
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('Error setting up database:', error)
    throw error
  }
}
