
import prismaHelper from '../helpers/prisma-helper'
import { PersonPrismaRepository } from './person'

describe('Person Prisma Repository', () => {
  beforeAll(async () => {
    await prismaHelper.connect()
  })

  afterAll(async () => {
    await prismaHelper.disconnect()
  })

  beforeEach(async () => {
    const client = await prismaHelper.getClient()
    await client.teacher.deleteMany({})
    await client.student.deleteMany({})
    await client.person.deleteMany({})
  })

  const makeSut = (): PersonPrismaRepository => {
    return new PersonPrismaRepository(prismaHelper)
  }

  test('Should return an person on success', async () => {
    const sut = makeSut()
    const person = await sut.add({
      name: 'any_name',
      email: 'any_email',
      birthDate: '2000-01-01'
    })
    expect(person).toBeTruthy()
    expect(person.id).toBeTruthy()
    expect(person.name).toBe('any_name')
    expect(person.email).toBe('any_email')
    expect(person.birthDate).toBe('2000-01-01')
  })
})
