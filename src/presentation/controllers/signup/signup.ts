import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { Controller, EmailValidator, HttpRequest, HttpResponse, AddPerson } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator,
    private readonly addPerson: AddPerson) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
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
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
