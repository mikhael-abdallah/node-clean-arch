import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { IntValidator } from '../../protocols/id-validator'

export class LinkStudentController implements Controller {
  constructor (private readonly intValidator: IntValidator) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest?.body?.id) {
      return badRequest(new MissingParamError('id'))
    }

    const isValid = this.intValidator.isValid(httpRequest.body.id)
    if (!isValid) {
      return badRequest(new InvalidParamError('id'))
    }

    return ok({})
  }
}
