import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddPerson, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addPerson: AddPerson,
    private readonly validation: Validation) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { name, birthDate, email } = httpRequest.body

      const person = await this.addPerson.add({
        name,
        email,
        birthDate
      })

      return ok(person)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return serverError(error)
      } else {
        return serverError()
      }
    }
  }
}
