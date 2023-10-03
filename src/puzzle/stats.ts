import { Entity } from '@/core'

export class Stats implements Entity<string> {
  public readonly id: string

  constructor(id: string) {
    this.id = id
  }

  get totalDelivered(): number {
    return 0
  }

  get totalValid(): number {
    return 0
  }
}
