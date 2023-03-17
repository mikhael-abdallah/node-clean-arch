import { ValidationComposite, RequiredFieldValidation } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'

export const makeLinkStudentValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['id', 'registerCode']) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}
