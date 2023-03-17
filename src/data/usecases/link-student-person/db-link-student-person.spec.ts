import { LinkStudentPersonModel } from '../../../domain/usecases/link-student-person'
import { LoadPersonByIdRepository } from '../../protocols/load-person-by-id-repository'
import { PersonModel } from '../add-person/db-add-person-protocols'
import { DbLinkStudentPerson } from './db-link-student-person'

const makeLinkStudentPerson = (): LinkStudentPersonModel => ({
  id: 3,
  registerCode: '0123456789'
})

describe('DbLinkStudentPerson Usecase', () => {
  test('Should call LoadPersonByIdRepository with correct id', async () => {
    class LoadPersonByIdRepositoryStub implements LoadPersonByIdRepository {
      async load (id: number): Promise<PersonModel> {
        const person: PersonModel = {
          id: 3,
          name: 'any_name',
          email: 'any@email.com'
        }
        return new Promise(resolve => { resolve(person) })
      }
    }

    const loadPersonByIdRepositoryStub = new LoadPersonByIdRepositoryStub()
    const sut = new DbLinkStudentPerson(loadPersonByIdRepositoryStub)
    const linkSpy = jest.spyOn(loadPersonByIdRepositoryStub, 'load')
    await sut.link(makeLinkStudentPerson())

    expect(linkSpy).toHaveBeenCalledWith(3)
  })
})
