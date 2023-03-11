
import { PersonPrismaRepository } from './person'
import prismaHelper from '../helpers/prisma-helper-mock'

describe('Person Prisma Repository', () => {
  beforeAll(async () => {
    await prismaHelper.connect()
  })

  afterAll(async () => {
    await prismaHelper.disconnect()
  })

  beforeEach(async () => {
    await prismaHelper.disconnect()
    await prismaHelper.connect()
  })

  const makeSut = (): PersonPrismaRepository => {
    return new PersonPrismaRepository(prismaHelper)
  }

  test('Should return an person on success', async () => {
    const sut = makeSut()
    const client = await prismaHelper.getClient()

    client.person.create.mockResolvedValueOnce({
      birth_date: new Date('2000-01-01'),
      change_date: new Date(),
      creation_date: new Date(),
      email: 'any_email',
      id: 1,
      name: 'any_name'
    })

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
