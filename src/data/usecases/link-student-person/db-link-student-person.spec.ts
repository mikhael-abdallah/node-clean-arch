import { LinkStudentPersonModel } from '../../../domain/usecases/link-student-person'
import { LoadPersonByIdRepository } from '../../protocols/load-person-by-id-repository'
import { PersonModel } from '../add-person/db-add-person-protocols'
import { DbLinkStudentPerson } from './db-link-student-person'

const makeLinkStudentPerson = (): LinkStudentPersonModel => ({
  id: 3,
  registerCode: '0123456789'
})

const makeFakePerson = (): PersonModel => ({
  id: 1,
  name: 'valid_name',
  email: 'valid_email'
})

const makeLoadPersonByIdRepository = (): LoadPersonByIdRepository => {
  class LoadPersonByIdRepositoryStub implements LoadPersonByIdRepository {
    async load (id: number): Promise<PersonModel> {
      return new Promise(resolve => { resolve(makeFakePerson()) })
    }
  }
  return new LoadPersonByIdRepositoryStub()
}
interface SutTypes {
  sut: DbLinkStudentPerson
  loadPersonByIdRepositoryStub: LoadPersonByIdRepository
}

const makeSut = (): SutTypes => {
  const loadPersonByIdRepositoryStub = makeLoadPersonByIdRepository()
  const sut = new DbLinkStudentPerson(loadPersonByIdRepositoryStub)
  return { sut, loadPersonByIdRepositoryStub }
}

describe('DbLinkStudentPerson Usecase', () => {
  test('Should call LoadPersonByIdRepository with correct id', async () => {
    const { loadPersonByIdRepositoryStub, sut } = makeSut()
    const linkSpy = jest.spyOn(loadPersonByIdRepositoryStub, 'load')
    await sut.link(makeLinkStudentPerson())

    expect(linkSpy).toHaveBeenCalledWith(3)
  })

  test('Should throw if  LoadPersonByIdRepository throws error', async () => {
    const { loadPersonByIdRepositoryStub, sut } = makeSut()
    jest.spyOn(loadPersonByIdRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.link(makeLinkStudentPerson())

    await expect(promise).rejects.toThrow()
  })
})
