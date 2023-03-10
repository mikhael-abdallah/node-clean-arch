import { SignUpController } from './signup.controller'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AddPerson, AddPersonModel, EmailValidator, PersonModel } from './signup-protocols'
import * as SignUpProtocols from './signup-protocols'

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
      const fakePerson = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email@mail.com',
        birthDate: '2000-01-01'
      }

      return new Promise(resolve => { resolve(fakePerson) })
    }
  }
  return new AddPersonStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addPersonStub: AddPerson
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addPersonStub = makeAddPerson()
  const sut = new SignUpController(emailValidatorStub, addPersonStub)

  return {
    sut, emailValidatorStub, addPersonStub
  }
}

describe('SignUp Controller', () => {
  test('Should import signUp protocols', () => {
    expect(typeof SignUpProtocols).toBe('object')
  })

  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut() // system under test
    const httpRequest = {
      body: {
        // name: "Nome da pesssoa",
        email: 'usuario@mail.com',
        birthDate: '2000-01-01'
      }

    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut() // system under test
    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        // email: 'usuario@mail.com',
        birthDate: '2000-01-01'
      }

    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut() // system under test
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        email: 'invalid_email@mail.com',
        birthDate: '2000-01-01'
      }

    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('birthDate'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut() // system under test
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        email: 'any_email@mail.com',
        birthDate: '2000-01-01'
      }

    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { emailValidatorStub, sut } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        email: 'any_email@mail.com',
        birthDate: '2000-01-01'
      }

    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddPerson throws', async () => {
    const { addPersonStub, sut } = makeSut()

    jest.spyOn(addPersonStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => { reject(new Error()) })
    })

    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        email: 'any_email@mail.com',
        birthDate: '2000-01-01'
      }

    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddPerson with correct values', async () => {
    const { sut, addPersonStub } = makeSut() // system under test
    const addSpy = jest.spyOn(addPersonStub, 'add')
    const httpRequest = {
      body: {
        name: 'Nome da pesssoa',
        email: 'any_email@mail.com',
        birthDate: '2000-01-01'
      }

    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Nome da pesssoa',
      email: 'any_email@mail.com',
      birthDate: '2000-01-01'
    })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut() // system under test
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        birthDate: '2000-01-01'
      }

    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 1,
      name: 'valid_name',
      email: 'valid_email@mail.com',
      birthDate: '2000-01-01'
    })
  })
})
