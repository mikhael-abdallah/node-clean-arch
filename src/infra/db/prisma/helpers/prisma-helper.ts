import { PrismaClient, Prisma } from '@prisma/client'

export const PrismaHelper = {
  client: null as unknown as PrismaClient | null,

  async connect (): Promise<void> {
    this.client = new PrismaClient()
  },

  async disconnect (): Promise<void> {
    await this.client?.$disconnect()
    this.client = null
  },

  getTable (table: Prisma.ModelName): any {
    if (!this.client) {
      this.client = new PrismaClient()
    }
    return this.client[table]
  }
}
