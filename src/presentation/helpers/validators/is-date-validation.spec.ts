import { InvalidParamError } from '../../errors'
import { IsDateValidation } from './is-date-validation'

const makeSut = (): IsDateValidation => {
  return new IsDateValidation('field')
}

describe('Is Date Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: '2000-01-01' })
    expect(error).toBeFalsy()
  })
})
