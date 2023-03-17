import { LinkStudentPersonModel } from '../../../domain/usecases/link-student-person'
import { LinkStudentPersonRepository } from '../../protocols/db/link-student-person-repository'
import { DbLinkStudentPerson } from './db-link-student-person'

const makeLinkStudentPerson = (): LinkStudentPersonModel => ({
  id: 3,
  registerCode: '0123456789'
})

const makeLinkStudentPersonRepository = (): LinkStudentPersonRepository => {
  class LinkStudentPersonRepositoryStub implements LinkStudentPersonRepository {
    async link (id: number): Promise<boolean> {
      return new Promise(resolve => { resolve(true) })
    }
  }
  return new LinkStudentPersonRepositoryStub()
}
interface SutTypes {
  sut: DbLinkStudentPerson
  linkStudentPersonRepositoryStub: LinkStudentPersonRepository
}

const makeSut = (): SutTypes => {
  const linkStudentPersonRepositoryStub = makeLinkStudentPersonRepository()
  const sut = new DbLinkStudentPerson(linkStudentPersonRepositoryStub)
  return { sut, linkStudentPersonRepositoryStub }
}

describe('DbLinkStudentPerson Usecase', () => {
  test('Should call LinkStudentPersonRepository with correct id', async () => {
    const { linkStudentPersonRepositoryStub, sut } = makeSut()
    const linkSpy = jest.spyOn(linkStudentPersonRepositoryStub, 'link')
    await sut.link(makeLinkStudentPerson())

    expect(linkSpy).toHaveBeenCalledWith(3)
  })

  test('Should return false if LinkStudentPersonRepository returns false', async () => {
    const { linkStudentPersonRepositoryStub, sut } = makeSut()
    jest.spyOn(linkStudentPersonRepositoryStub, 'link').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
    const hasLinked = await sut.link(makeLinkStudentPerson())

    expect(hasLinked).toBe(false)
  })

  test('Should throw if LinkStudentPersonRepository throws error', async () => {
    const { linkStudentPersonRepositoryStub, sut } = makeSut()
    jest.spyOn(linkStudentPersonRepositoryStub, 'link')
      .mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.link(makeLinkStudentPerson())

    await expect(promise).rejects.toThrow()
  })
})
