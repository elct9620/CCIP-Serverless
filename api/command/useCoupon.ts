import { Command } from '@/core'

export type UseCouponInput = {
  token: string
  eventId: string
}

export class UseCouponCommand implements Command<UseCouponInput, boolean> {
  constructor() {}

  public async execute(_input: UseCouponInput): Promise<boolean> {
    return true
  }
}
