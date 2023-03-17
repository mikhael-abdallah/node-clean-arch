import { LinkStudentPerson, LinkStudentPersonModel } from '../../../domain/usecases/link-student-person'
import { LoadPersonByIdRepository } from '../../protocols/load-person-by-id-repository'

export class DbLinkStudentPerson implements LinkStudentPerson {
  constructor (private readonly loadPersonByIdRepository: LoadPersonByIdRepository) {}
  async link (linkStudentPerson: LinkStudentPersonModel): Promise<boolean> {
    const { id } = linkStudentPerson
    await this.loadPersonByIdRepository.load(id)
    return false
  }
}
