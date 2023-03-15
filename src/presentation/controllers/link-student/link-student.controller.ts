import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { IntValidator } from '../../protocols/id-validator'

export class LinkStudentController implements Controller {
  constructor (private readonly intValidator: IntValidator) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }

      const isValid = this.intValidator.isValid(id)
      if (!isValid) {
        return badRequest(new InvalidParamError('id'))
      }

      return ok({})
    } catch (error: unknown) {
      if (error instanceof Error) {
        return serverError(error)
      } else {
        return serverError()
      }
    }
  }
}
