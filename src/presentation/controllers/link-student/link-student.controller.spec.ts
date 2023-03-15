import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LinkStudentController } from './link-student.controller'

interface SutTypes {
  sut: LinkStudentController
}

const makeSut = (): SutTypes => {
  const sut = new LinkStudentController()
  return { sut }
}

describe('Link Student Controller', () => {
  test('Should return 400 if no personId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })
})
