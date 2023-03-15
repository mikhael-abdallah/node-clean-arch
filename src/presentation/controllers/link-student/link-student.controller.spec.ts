import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
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
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })

  test('Should return 400 if an invalid int id is provided', async () => {
    const { sut, intValidatorStub } = makeSut()
    jest.spyOn(intValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        id: 3
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('id')))
  })

  test('Should call IntValidator with correct id', async () => {
    const { sut, intValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(intValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        id: 3
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(3)
  })
})
