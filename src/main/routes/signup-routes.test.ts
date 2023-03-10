
import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
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
