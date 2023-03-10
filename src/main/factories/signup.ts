import { DbAddPerson } from '../../data/usecases/add-person/db-add-person'
import { PersonMongoRepository } from '../../infra/db/mongodb/person-repository/person'
import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const personMongoRepository = new PersonMongoRepository()
  const dbAddPerson = new DbAddPerson(personMongoRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddPerson)
  return new LogControllerDecorator(signUpController)
}
