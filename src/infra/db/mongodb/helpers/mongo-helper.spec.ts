import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    const mongoUrl: string = process.env.MONGO_URL as string
    expect(mongoUrl).toBeTruthy()
    await sut.connect(mongoUrl)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconnect if mongodb is down', async () => {
    let personCollection = await sut.getCollection('person')
    expect(personCollection).toBeTruthy()
    await sut.disconnect()
    personCollection = await sut.getCollection('person')
    expect(personCollection).toBeTruthy()
  })
})
