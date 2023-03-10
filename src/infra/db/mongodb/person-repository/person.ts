import { AddPersonRepository } from '../../../../data/protocols/add-person-repository'
import { PersonModel } from '../../../../domain/models/person'
import { AddPersonModel } from '../../../../domain/usecases/add-person'
import { MongoHelper } from '../helpers/mongo-helper'

export class PersonMongoRepository implements AddPersonRepository {
  async add (personData: AddPersonModel): Promise<PersonModel> {
    const personCollection = MongoHelper.getCollection('person')
    const result = await personCollection.insertOne(personData)
    const person = result.ops[0]
    const { _id, ...personWithoutId } = person
    return {
      ...personWithoutId,
      id: _id
    }
  }
}
