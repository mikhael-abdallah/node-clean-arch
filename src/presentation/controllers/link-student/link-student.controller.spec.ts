import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { IntValidator } from '../../protocols/id-validator'
import { LinkStudentController } from './link-student.controller'

const makeIntValidator = (): IntValidator => {
  class IntValidatorStub implements IntValidator {
    isValid (id: number): boolean {
      return true
    }
  }

  return new IntValidatorStub()
}

const makeFakeRequest = (): HttpRequest => (
  {
    body: {
      id: 3
    }
  })

interface SutTypes {
  sut: LinkStudentController
  intValidatorStub: IntValidator
}

const makeSut = (): SutTypes => {
  const intValidatorStub = makeIntValidator()
  const sut = new LinkStudentController(intValidatorStub)
  return { sut, intValidatorStub }
}

describe('Link Student Controller', () => {
  test('Should return 400 if no personId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        // id: 3
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })

  test('Should return 400 if an invalid int id is provided', async () => {
    const { sut, intValidatorStub } = makeSut()
    jest.spyOn(intValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('id')))
  })

  test('Should call IntValidator with correct id', async () => {
    const { sut, intValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(intValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith(3)
  })

  test('Should return 500 if IntValidator throws', async () => {
    const { sut, intValidatorStub } = makeSut()
    jest.spyOn(intValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError())
  })
})
