import { PrismaClient } from '@prisma/client'
import { getPrismaClient } from './lib/prisma'

export interface Context {
  prisma: PrismaClient
  port: number
}

export const prepareContext = (): Context => {
  const prisma = getPrismaClient()
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
  return { prisma, port }
}
