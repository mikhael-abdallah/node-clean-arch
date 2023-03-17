import prismaHelperMock from './prisma-helper-mock'
const sut = prismaHelperMock

describe('Prisma Helper', () => {
  beforeAll(async () => {
    await prismaHelperMock.connect()
  })

  afterAll(async () => {
    await prismaHelperMock.disconnect()
  })

  beforeEach(async () => {
    await prismaHelperMock.disconnect()
    await prismaHelperMock.connect()
  })

  test('Should reconnect if prisma is down', async () => {
    let client = await prismaHelperMock.getClient()

    client.$queryRaw.mockResolvedValue(1)
    let testConnection = await (await sut.getClient()).$queryRaw`SELECT 1`
    expect(testConnection).toBeTruthy()
    await sut.disconnect()
    client = await sut.getClient()
    client.$queryRaw.mockResolvedValue(1)
    testConnection = await client.$queryRaw`SELECT 1`
    expect(testConnection).toBeTruthy()
  })
})
