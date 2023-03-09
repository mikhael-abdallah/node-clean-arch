import { PersonModel } from '../models/person'

export interface AddPersonModel {
  name: string
  email: string
  birthDate: string
}

export interface AddPerson {
  add: (Person: AddPersonModel) => Promise<PersonModel>
}
