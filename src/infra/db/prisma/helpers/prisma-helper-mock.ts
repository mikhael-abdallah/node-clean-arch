import { PrismaClient } from '@prisma/client'
import { PrismaHelperInterface } from './prisma-helper.inteface'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

class PrismaHelperMock implements PrismaHelperInterface {
  private client = null as unknown as DeepMockProxy<PrismaClient> | null

  async connect (): Promise<void> {
    this.client = mockDeep<PrismaClient>()
  }

  async disconnect (): Promise<void> {
    await this.client?.$disconnect()
    this.client = null
  }

  async getClient (): Promise<DeepMockProxy<PrismaClient>> {
    if (!this.client) {
      await this.connect()
    }
    return this.client as DeepMockProxy<PrismaClient>
  }
}

const prismaHelper = new PrismaHelperMock()

export default prismaHelper
