import { MissingParamError } from '../../errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error | undefined {
    const field = input?.[this.fieldName]
    if (field === '' || field === null || field === undefined) {
      return new MissingParamError(this.fieldName)
    }
  }
}
