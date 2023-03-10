
import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    const mongoUrl: string = process.env.MONGO_URL as string
    expect(mongoUrl).toBeTruthy()
    await MongoHelper.connect(mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const personCollection = MongoHelper.getCollection('person')
    await personCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Mikhael',
        email: 'mikhael@gmail.com',
        birthDate: '2001-11-22'
      })
      .expect(200)
  })
})
