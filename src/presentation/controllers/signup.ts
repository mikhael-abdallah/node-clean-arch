import { badRequest, serverError } from '../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../errors'
import { type Controller, type EmailValidator, type HttpRequest, type HttpResponse } from '../protocols'
export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {

  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { birthDate, email } = httpRequest.body

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

      return {
        statusCode: 200,
        body: {
          success: 'true'
        }
      }
    } catch (error) {
      return serverError()
    }
  }
}
