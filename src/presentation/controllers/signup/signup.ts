import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse, type AddPerson } from './signup-protocols'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator,
    private readonly addPerson: AddPerson) {
  }

  handle (httpRequest: HttpRequest): HttpResponse {
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

      const person = this.addPerson.add({
        name,
        email,
        birthDate
      })

      return {
        statusCode: 200,
        body: person
      }
    } catch (error) {
      return serverError()
    }
  }
}
