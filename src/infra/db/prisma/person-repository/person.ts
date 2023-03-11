import { AddPersonModel } from '../../../../domain/usecases/add-person'
import { PersonModel } from '../../../../domain/models/person'
import { PrismaHelperInterface } from '../helpers/prisma-helper.inteface'

export class PersonPrismaRepository {
  constructor (private readonly prismaHelper: PrismaHelperInterface) {}

  async add (personData: AddPersonModel): Promise<PersonModel> {
    const client = await this.prismaHelper.getClient()
    const { birthDate, ...restPersonData } = personData
    const person = await client.person.create({
      data: {
        ...restPersonData,
        birth_date: new Date(birthDate)
      }
    })
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { birth_date, ...restPerson } = person
    return {
      birthDate: birth_date.toISOString().split('T')[0],
      ...restPerson
    }
  }
}
