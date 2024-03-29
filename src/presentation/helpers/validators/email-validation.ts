import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string,
    private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error | undefined {
    const value = input?.[this.fieldName]
    const isValid = typeof value === 'string' && this.emailValidator.isValid(value)

    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
