import { PrismaClient } from '@prisma/client'

// Initialize Prisma client with optional URL
const createPrismaClient = (databaseUrl?: string) => {
  const prismaOptions: any = {}

  // If a database URL is provided, use it
  if (databaseUrl) {
    prismaOptions.datasources = {
      db: {
        url: databaseUrl,
      },
    }
  }

  return new PrismaClient(prismaOptions)
}

// Create the default Prisma client
const prisma = createPrismaClient()

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma
export { createPrismaClient }
