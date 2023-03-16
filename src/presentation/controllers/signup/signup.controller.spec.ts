import { SignUpController } from './signup.controller'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { HttpRequest, AddPerson, AddPersonModel, EmailValidator, PersonModel, Validation } from './signup-protocols'
import * as SignUpProtocols from './signup-protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStup implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStup()
}

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
  emailValidatorStub: EmailValidator
  addPersonStub: AddPerson
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addPersonStub = makeAddPerson()
  const validationStub = makeValidation()
  const sut = new SignUpController(emailValidatorStub, addPersonStub, validationStub)

  return {
    sut, emailValidatorStub, addPersonStub, validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should import signUp protocols', () => {
    expect(typeof SignUpProtocols).toBe('object')
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut() // system under test
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should return 400 if an birthDate confirmation fails', async () => {
    const { sut } = makeSut() // system under test
    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        email: 'invalid_email@mail.com',
        birthDate: 'asdlfkj'
      }

    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('birthDate')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut() // system under test
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
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

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut() // system under test
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakePerson()))
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut() // system under test
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
