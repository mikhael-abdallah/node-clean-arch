import { AddPerson, AddPersonModel, AddPersonRepository, PersonModel } from './db-add-person-protocols'

export class DbAddPerson implements AddPerson {
  constructor (private readonly addPersonRepository: AddPersonRepository) {

  }

  async add (personData: AddPersonModel): Promise<PersonModel> {
    const person = await this.addPersonRepository.add(personData)

    return person
  }
}
