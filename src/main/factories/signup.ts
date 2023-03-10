import { DbAddPerson } from '../../data/usecases/add-person/db-add-person'
import { PersonMongoRepository } from '../../infra/db/mongodb/person-repository/person'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const personMongoRepository = new PersonMongoRepository()
  const dbAddPerson = new DbAddPerson(personMongoRepository)
  return new SignUpController(emailValidatorAdapter, dbAddPerson)
}
