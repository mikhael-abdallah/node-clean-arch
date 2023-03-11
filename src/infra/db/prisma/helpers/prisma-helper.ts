import { PrismaClient } from '@prisma/client'
import { PrismaHelperInterface } from './prisma-helper.inteface'

class PrismaHelper implements PrismaHelperInterface {
  private client = null as unknown as PrismaClient | null

  async connect (): Promise<void> {
    this.client = new PrismaClient()
  }

  async disconnect (): Promise<void> {
    await this.client?.$disconnect()
    this.client = null
  }

  async getClient (): Promise<PrismaClient> {
    if (!this.client) {
      this.client = new PrismaClient()
    }
    return this.client
  }
}

const prismaHelper = new PrismaHelper()

export default prismaHelper
