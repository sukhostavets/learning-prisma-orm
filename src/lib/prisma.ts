import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

export const getPrismaClient = (databaseUrl?: string) => {
  if (!prisma) {
    const prismaOptions: any = {}

    // If a database URL is provided, use it
    if (databaseUrl) {
      prismaOptions.datasources = {
        db: {
          url: databaseUrl,
        },
      }
    }

    prisma = new PrismaClient(prismaOptions)

    process.on('SIGINT', async () => {
      await prisma.$disconnect()
      process.exit(0)
    })

    process.on('SIGTERM', async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
  }

  return prisma
}
