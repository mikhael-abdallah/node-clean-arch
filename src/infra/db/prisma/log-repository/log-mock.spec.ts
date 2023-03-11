import { LogPrismaRepository } from './log'
import prismaHelperMock from '../helpers/prisma-helper-mock'

const makeSut = (): LogPrismaRepository => {
  return new LogPrismaRepository(prismaHelperMock)
}

describe('Log Prisma Repository', () => {
  beforeAll(async () => {
    await prismaHelperMock.connect()
  })

  afterAll(async () => {
    await prismaHelperMock.disconnect()
  })

  beforeEach(async () => {
    const client = await prismaHelperMock.getClient()
    await client.log_error.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    const client = await prismaHelperMock.getClient()
    const table = client.log_error

    const logSpy = jest.spyOn(table, 'create')

    await sut.logError('any_error')

    expect(logSpy).toHaveBeenCalledWith({
      data: { message: 'any_error' }
    })

    expect(logSpy).toHaveBeenCalledTimes(1)
  })
})
