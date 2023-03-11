import { PrismaClient } from '@prisma/client'

export interface PrismaHelperInterface {

  connect: () => Promise<void>

  disconnect: () => Promise<void>

  getClient: () => Promise<PrismaClient>
}
