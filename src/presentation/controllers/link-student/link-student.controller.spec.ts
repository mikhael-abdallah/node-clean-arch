import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { badRequest, serverError, notFound } from '../../helpers/http-helper'
import { IntValidator, LinkStudentPerson, RegisterCodeValidator, HttpRequest } from './link-student-protocols'
import { LinkStudentController } from './link-student.controller'

const makeIntValidator = (): IntValidator => {
  class IntValidatorStub implements IntValidator {
    isValid (id: number): boolean {
      return true
    }
  }

  return new IntValidatorStub()
}

const makeLinkStudentPerson = (): LinkStudentPerson => {
  class LinkStudentPersonStub implements LinkStudentPerson {
    async link (id: number, registerCode: string): Promise<boolean> {
      return true
    }
  }

  return new LinkStudentPersonStub()
}

const makeRegisterCodeValidator = (): RegisterCodeValidator => {
  class RegisterCodeValidatorStub implements RegisterCodeValidator {
    isValid (registerCode: string): boolean {
      return true
    }
  }

  return new RegisterCodeValidatorStub()
}

const makeFakeRequest = (): HttpRequest => (
  {
    body: {
      id: 3,
      registerCode: '0123456789'
    }
  })

interface SutTypes {
  sut: LinkStudentController
  intValidatorStub: IntValidator
  registerCodeValidatorStub: RegisterCodeValidator
  linkStudentPersonStub: LinkStudentPerson
}

const makeSut = (): SutTypes => {
  const intValidatorStub = makeIntValidator()
  const registerCodeValidatorStub = makeRegisterCodeValidator()
  const linkStudentPersonStub = makeLinkStudentPerson()
  const sut = new LinkStudentController(intValidatorStub, registerCodeValidatorStub, linkStudentPersonStub)

  return { sut, intValidatorStub, registerCodeValidatorStub, linkStudentPersonStub }
}

describe('Link Student Controller', () => {
  test('Should return 400 if no personId is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        // id: 3
        registerCode: '0123456789'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })

  test('Should return 400 if no registerCode is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        id: 3
        // registerCode: '0003485829'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('registerCode')))
  })

  test('Should return 400 if an invalid int id is provided', async () => {
    const { sut, intValidatorStub } = makeSut()
    jest.spyOn(intValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('id')))
  })

  test('Should return 400 if an invalid regiter code is provided', async () => {
    const { sut, registerCodeValidatorStub } = makeSut()
    jest.spyOn(registerCodeValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('registerCode')))
  })

  test('Should call RegisterCodeValidator with correct value', async () => {
    const { sut, registerCodeValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(registerCodeValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('0123456789')
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

  test('Should return 500 if LinkStudentPerson throws', async () => {
    const { linkStudentPersonStub, sut } = makeSut()

    jest.spyOn(linkStudentPersonStub, 'link').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call Linker with correct value', async () => {
    const { sut, linkStudentPersonStub } = makeSut()
    const linkSpy = jest.spyOn(linkStudentPersonStub, 'link')
    await sut.handle(makeFakeRequest())
    expect(linkSpy).toHaveBeenCalledWith(3, '0123456789')
  })

  test('Should return 404 if id not found', async () => {
    const { sut, linkStudentPersonStub } = makeSut()
    jest.spyOn(linkStudentPersonStub, 'link').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound())
  })
})
