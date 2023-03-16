import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  constructor (private readonly fieldName: string,
    private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error | undefined {
    const value = input?.[this.fieldName]
    const isValid = typeof value === 'string' && this.emailValidator.isValid(value)
    console.log('is not throwing')

    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
