import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class IsDateValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | undefined {
    const value = input?.[this.fieldName]
    if (!value) return undefined
    const isValid = !Number.isNaN(Date.parse(value))
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
