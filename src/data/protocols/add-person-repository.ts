import { PersonModel } from '../../domain/models/person'
import { AddPersonModel } from '../../domain/usecases/add-person'

export interface AddPersonRepository {

  add: (personDate: AddPersonModel) => Promise<PersonModel>
}
