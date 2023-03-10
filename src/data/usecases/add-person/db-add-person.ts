import { AddPerson, AddPersonModel, AddPersonRepository, PersonModel } from './db-add-person-protocols'

export class DbAddPerson implements AddPerson {
  constructor (private readonly addPersonRepository: AddPersonRepository) {

  }

  async add (personData: AddPersonModel): Promise<PersonModel> {
    await this.addPersonRepository.add(personData)

    return new Promise(resolve => {
      resolve({
        ...personData,
        id: 1
      })
    })
  }
}
