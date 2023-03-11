import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { PrismaHelperInterface } from '../helpers/prisma-helper.inteface'

export class LogPrismaRepository implements LogErrorRepository {
  constructor (private readonly prismaHelper: PrismaHelperInterface) {}
  async logError (stack: string): Promise<void> {
    const client = await this.prismaHelper.getClient()
    await client.log_error.create({
      data: { message: stack }
    })
  }
}
