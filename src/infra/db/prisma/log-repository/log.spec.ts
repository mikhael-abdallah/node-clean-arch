import { LogPrismaRepository } from './log'
import prismaHelper from '../helpers/prisma-helper'

const makeSut = (): LogPrismaRepository => {
  return new LogPrismaRepository(prismaHelper)
}

describe('Log Prisma Repository', () => {
  beforeAll(async () => {
    await prismaHelper.connect()
  })

  afterAll(async () => {
    await prismaHelper.disconnect()
  })

  beforeEach(async () => {
    const client = await prismaHelper.getClient()
    await client.log_error.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const count = await (await prismaHelper.getClient()).log_error.count()
    expect(count).toBe(1)
  })
})
