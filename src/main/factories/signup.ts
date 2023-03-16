import { DbAddPerson } from '../../data/usecases/add-person/db-add-person'
// import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
// import { PersonMongoRepository } from '../../infra/db/mongodb/person-repository/person'
import prismaHelper from '../../infra/db/prisma/helpers/prisma-helper'
import { LogPrismaRepository } from '../../infra/db/prisma/log-repository/log'
import { PersonPrismaRepository } from '../../infra/db/prisma/person-repository/person'
import { SignUpController } from '../../presentation/controllers/signup/signup.controller'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  // const personMongoRepository = new PersonMongoRepository()
  // const logMongoRepository = new LogMongoRepository()
  const personPrismaRepository = new PersonPrismaRepository(prismaHelper)
  const logPrismaRepository = new LogPrismaRepository(prismaHelper)
  const dbAddPerson = new DbAddPerson(personPrismaRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddPerson, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logPrismaRepository)
}
