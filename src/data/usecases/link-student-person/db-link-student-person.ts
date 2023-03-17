import { LinkStudentPerson, LinkStudentPersonModel } from '../../../domain/usecases/link-student-person'
import { LinkStudentPersonRepository } from '../../protocols/db/link-student-person-repository'

export class DbLinkStudentPerson implements LinkStudentPerson {
  constructor (private readonly linkPersonStudentRepository: LinkStudentPersonRepository) {}
  async link (linkStudentPerson: LinkStudentPersonModel): Promise<boolean> {
    const { id } = linkStudentPerson
    return await this.linkPersonStudentRepository.link(id)
  }
}
