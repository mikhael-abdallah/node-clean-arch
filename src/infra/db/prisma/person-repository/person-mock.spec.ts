
import { PersonPrismaRepository } from './person'
import prismaHelperMock from '../helpers/prisma-helper-mock'

describe('Person Prisma Repository', () => {
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

  const makeSut = (): PersonPrismaRepository => {
    return new PersonPrismaRepository(prismaHelperMock)
  }

  test('Should return an person on success', async () => {
    const sut = makeSut()
    const client = await prismaHelperMock.getClient()

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
