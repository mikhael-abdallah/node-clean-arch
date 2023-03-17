import { LogErrorRepository } from '../../data/protocols/db/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      try {
        await this.logErrorRepository.logError(httpResponse.body.stack)
      } catch (error) { console.log(error) }
    }
    return httpResponse
  }
}
