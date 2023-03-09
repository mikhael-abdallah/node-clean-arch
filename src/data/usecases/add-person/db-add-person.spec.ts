import { DbAddPerson } from './db-add-person'

interface SutTypes {
  sut: DbAddPerson
}

const makeSut = (): SutTypes => {
  const sut = new DbAddPerson()
  return { sut }
}

describe('DbAddPerson Usecase', () => {
  test('', async () => {
    const { sut } = makeSut()
    const personData = {
      name: 'valid_name',
      email: 'valid_email',
      birthDate: 'valid_birthDate'
    }
    await sut.add(personData)
  })
})
