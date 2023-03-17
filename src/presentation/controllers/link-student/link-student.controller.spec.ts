import { MissingParamError } from '../../errors'
import { badRequest, notFound, ok } from '../../helpers/http-helper'
import { Validation } from '../signup/signup-protocols'
import { LinkStudentPerson, HttpRequest } from './link-student-protocols'
import { LinkStudentController } from './link-student.controller'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeLinkStudentPerson = (): LinkStudentPerson => {
  class LinkStudentPersonStub implements LinkStudentPerson {
    async link (id: number, registerCode: string): Promise<boolean> {
      return true
    }
  }

  return new LinkStudentPersonStub()
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
  linkStudentPersonStub: LinkStudentPerson
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const linkStudentPersonStub = makeLinkStudentPerson()
  const validationStub = makeValidation()
  const sut = new LinkStudentController(linkStudentPersonStub, validationStub)

  return { sut, linkStudentPersonStub, validationStub }
}

describe('Link Student Controller', () => {
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

  test('Should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut() // system under test
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    const httpRequest = makeFakeRequest()
    expect(validateSpy).toHaveBeenCalledWith(httpRequest?.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut() // system under test
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ success: true }))
  })
})
