import prismaHelper from './prisma-helper'
const sut = prismaHelper

describe('Prisma Helper', () => {
  beforeAll(async () => {
    await sut.connect()
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if prisma is down', async () => {
    let testConnection = await (await sut.getClient()).$queryRaw`SELECT 1`
    expect(testConnection).toBeTruthy()
    await sut.disconnect()
    testConnection = await (await sut.getClient()).$queryRaw`SELECT 1`
    expect(testConnection).toBeTruthy()
  })
})
