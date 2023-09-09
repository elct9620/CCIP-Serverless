import { DomainEvent } from '@/core'

export abstract class ActivityEvent implements DomainEvent {
  public readonly id: string
  public readonly aggregateId: string
  public readonly occurredAt: Date

  constructor(id: string, aggregateId: string, occurredAt: Date) {
    this.id = id
    this.aggregateId = aggregateId
    this.occurredAt = occurredAt
  }
}

export class AttendeeInitialized extends ActivityEvent {
  public readonly displayName: string

  constructor(id: string, aggregateId: string, occurredAt: Date, displayName: string) {
    super(id, aggregateId, occurredAt)
    this.displayName = displayName
  }
}
