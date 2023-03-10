import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('LogControllerDecorator', () => {
  test('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          body: {
            id: 1,
            email: 'any_email@mail.com',
            name: 'any_name',
            birthDate: '2000-01-01'
          },
          statusCode: 200
        }
        return new Promise(resolve => { resolve(httpResponse) })
      }
    }
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        birthDate: '2000-01-01'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
