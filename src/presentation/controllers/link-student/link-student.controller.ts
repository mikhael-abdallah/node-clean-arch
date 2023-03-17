import { badRequest, notFound, ok, serverError } from '../../helpers/http-helper'
import { Validation } from '../signup/signup-protocols'
import { LinkStudentPerson, Controller, HttpRequest, HttpResponse } from './link-student-protocols'

export class LinkStudentController implements Controller {
  constructor (private readonly linkStudentPerson: LinkStudentPerson,
    private readonly validation: Validation) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { id, registerCode } = httpRequest.body

      const hasLinked = await this.linkStudentPerson.link(id, registerCode)

      if (!hasLinked) {
        return notFound()
      }

      return ok({ success: hasLinked })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return serverError(error)
      } else {
        return serverError()
      }
    }
  }
}
