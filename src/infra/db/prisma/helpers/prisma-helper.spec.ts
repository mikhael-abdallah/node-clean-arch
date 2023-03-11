
import { PrismaHelper as sut } from './prisma-helper'

describe('Prisma Helper', () => {
  beforeAll(async () => {
    await sut.connect()
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if prisma is down', async () => {
    let personTable = await sut.getTable('person')
    expect(personTable).toBeTruthy()
    await sut.disconnect()
    personTable = await sut.getTable('person')
    expect(personTable).toBeTruthy()
  })
})
