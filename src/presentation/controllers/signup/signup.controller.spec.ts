import { SignUpController } from './signup.controller'
import { MissingParamError, ServerError } from '../../errors'
import { HttpRequest, AddPerson, AddPersonModel, PersonModel, Validation } from './signup-protocols'
import * as SignUpProtocols from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

const makeAddPerson = (): AddPerson => {
  class AddPersonStub implements AddPerson {
    async add (Person: AddPersonModel): Promise<PersonModel> {
      return new Promise(resolve => { resolve(makeFakePerson()) })
    }
  }
  return new AddPersonStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

const makeFakePerson = (): PersonModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email@mail.com',
  birthDate: '2000-01-01'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    birthDate: '2000-01-01'
  }
})

interface SutTypes {
  sut: SignUpController
  addPersonStub: AddPerson
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addPersonStub = makeAddPerson()
  const validationStub = makeValidation()
  const sut = new SignUpController(addPersonStub, validationStub)

  return {
    sut, addPersonStub, validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should import signUp protocols', () => {
    expect(typeof SignUpProtocols).toBe('object')
  })

  test('Should return 500 if AddPerson throws', async () => {
    const { addPersonStub, sut } = makeSut()

    jest.spyOn(addPersonStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call AddPerson with correct values', async () => {
    const { sut, addPersonStub } = makeSut() // system under test
    const addSpy = jest.spyOn(addPersonStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      birthDate: '2000-01-01'
    })
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

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut() // system under test
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakePerson()))
  })
})
