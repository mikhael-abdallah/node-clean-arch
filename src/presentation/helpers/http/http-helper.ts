import { NotFoundError, ServerError } from '../../errors'
import { HttpResponse } from '../../protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const notFound = (): HttpResponse => ({
  statusCode: 404,
  body: new NotFoundError()
})

export const serverError = (error?: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error?.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
