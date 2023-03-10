import { MongoHelper } from '../helpers/mongo-helper'
import { PersonMongoRepository } from './person'

describe('Person Mongo Repository', () => {
  beforeAll(async () => {
    const mongoUrl: string = process.env.MONGO_URL as string
    expect(mongoUrl).toBeTruthy()
    await MongoHelper.connect(mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const personCollection = await MongoHelper.getCollection('person')
    await personCollection.deleteMany({})
  })

  const makeSut = (): PersonMongoRepository => {
    return new PersonMongoRepository()
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
