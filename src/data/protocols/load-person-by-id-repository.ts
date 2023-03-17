import { PersonModel } from '../../domain/models/person'

export interface LoadPersonByIdRepository {
  load: (id: number) => Promise<PersonModel>
}
