import { DbAddPerson } from './db-add-person'
import { AddPersonModel, AddPersonRepository, PersonModel } from './db-add-person-protocols'
import * as addPersonProtocols from './db-add-person-protocols'

const makeAddPersonRepository = (): AddPersonRepository => {
  class AddPersonRepositoryStub implements AddPersonRepository {
    async add (personDate: AddPersonModel): Promise<PersonModel> {
      const fakePerson = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email',
        birthDate: '2000-01-01'
      }
      return new Promise(resolve => { resolve(fakePerson) })
    }
  }

  return new AddPersonRepositoryStub()
}

interface SutTypes {
  sut: DbAddPerson
  addPersonRepositoryStub: AddPersonRepository
}

const makeSut = (): SutTypes => {
  const addPersonRepositoryStub = makeAddPersonRepository()
  const sut = new DbAddPerson(addPersonRepositoryStub)
  return { sut, addPersonRepositoryStub }
}

describe('DbAddPerson Usecase', () => {
  test('Should import addPerson protocols', () => {
    expect(typeof addPersonProtocols).toBe('object')
  })

  test('Should call AddPersonRepository with correct values', async () => {
    const { sut, addPersonRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addPersonRepositoryStub, 'add')

    const personData = {
      name: 'valid_name',
      email: 'valid_email',
      birthDate: '2000-01-01'
    }
    await sut.add(personData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      birthDate: '2000-01-01'
    })
  })

  test('Should throw if DbAddPersonRepository throws', async () => {
    const { sut, addPersonRepositoryStub } = makeSut()

    jest.spyOn(addPersonRepositoryStub, 'add').mockReturnValueOnce(
      new Promise((resolve, reject) => { reject(new Error()) })
    )

    const personData = {
      name: 'valid_name',
      email: 'valid_email',
      birthDate: '2000-01-01'
    }
    const promise = sut.add(personData)

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const personData = {
      name: 'valid_name',
      email: 'valid_email',
      birthDate: '2000-01-01'
    }

    const person = await sut.add(personData)

    expect(person).toEqual({
      id: 1,
      name: 'valid_name',
      email: 'valid_email',
      birthDate: '2000-01-01'
    })
  })
})
