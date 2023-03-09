import { AddPerson, AddPersonModel, PersonModel } from './db-add-person-protocols'

export class DbAddPerson implements AddPerson {
  async add (person: AddPersonModel): Promise<PersonModel> {
    return new Promise(resolve => {
      resolve({
        ...person,
        id: 1
      })
    })
  }
}
