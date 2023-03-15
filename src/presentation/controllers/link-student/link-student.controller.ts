import { LinkStudentPerson } from '../../../domain/usecases/link-student-person'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { IntValidator } from '../../protocols/id-validator'
import { RegisterCodeValidator } from '../../protocols/register-code-validator'

export class LinkStudentController implements Controller {
  constructor (private readonly intValidator: IntValidator,
    private readonly registerCodeValidator: RegisterCodeValidator,
    private readonly linkStudentPerson: LinkStudentPerson) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, registerCode } = httpRequest.body
      if (!id) {
        return badRequest(new MissingParamError('id'))
      }

      if (!registerCode) {
        return badRequest(new MissingParamError('registerCode'))
      }

      const isIdValid = this.intValidator.isValid(id)
      if (!isIdValid) {
        return badRequest(new InvalidParamError('id'))
      }

      const isRegisterCodeValid = this.registerCodeValidator.isValid(registerCode)

      if (!isRegisterCodeValid) {
        return badRequest(new InvalidParamError('registerCode'))
      }

      await this.linkStudentPerson.link(id, registerCode)

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
