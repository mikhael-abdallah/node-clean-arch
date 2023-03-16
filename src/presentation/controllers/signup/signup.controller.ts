import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddPerson, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator,
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

      if (birthDate) {
        const date = birthDate
        const isValidDate = !Number.isNaN(Date.parse(date))
        if (!isValidDate) {
          return badRequest(new InvalidParamError('birthDate'))
        }
      }

      const isValid = this.emailValidator.isValid(email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

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
