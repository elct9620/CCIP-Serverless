import { AggregateRoot, Replayable } from '@/core'
import { StatEvent } from './event'

@Replayable
export class Stats extends AggregateRoot<string, StatEvent> {
  constructor(id: string) {
    super(id)
  }

  get totalDelivered(): number {
    return 0
  }

  get totalValid(): number {
    return 0
  }
}
