import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, notFound, ok, serverError } from '../../helpers/http-helper'
import { LinkStudentPerson, Controller, HttpRequest, HttpResponse, IntValidator, RegisterCodeValidator } from './link-student-protocols'

export class LinkStudentController implements Controller {
  constructor (private readonly intValidator: IntValidator,
    private readonly registerCodeValidator: RegisterCodeValidator,
    private readonly linkStudentPerson: LinkStudentPerson) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, registerCode } = httpRequest.body

      const requiredFields = ['id', 'registerCode']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isIdValid = this.intValidator.isValid(id)
      if (!isIdValid) {
        return badRequest(new InvalidParamError('id'))
      }

      const isRegisterCodeValid = this.registerCodeValidator.isValid(registerCode)

      if (!isRegisterCodeValid) {
        return badRequest(new InvalidParamError('registerCode'))
      }

      const hasLinked = await this.linkStudentPerson.link(id, registerCode)

      if (!hasLinked) {
        return notFound()
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
