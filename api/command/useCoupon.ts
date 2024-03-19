import { Repository, Command } from '@/core'
import { Status } from '@/puzzle'
import { PuzzleReceiverNotFoundError } from './errors'

export type UseCouponInput = {
  publicToken: string
}

export class UseCouponCommand implements Command<UseCouponInput, boolean> {
  private readonly statuses: Repository<Status>

  constructor(status: Repository<Status>) {
    this.statuses = status
  }

  public async execute({ publicToken }: UseCouponInput): Promise<boolean> {
    const status = await this.statuses.findById(publicToken)
    if (!status) {
      throw new PuzzleReceiverNotFoundError()
    }

    if (status.isNew()) {
      return false
    }

    status.redeem()
    await this.statuses.save(status)

    return true
  }
}
