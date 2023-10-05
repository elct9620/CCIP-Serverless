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

export class PuzzleCollected extends ActivityEvent {
  public readonly pieceName: string
  public readonly giverName: string

  constructor(id: string, aggregateId: string, occurredAt: Date, name: string, giverName: string) {
    super(id, aggregateId, occurredAt)
    this.pieceName = name
    this.giverName = giverName
  }
}

export abstract class StatEvent implements DomainEvent {
  public readonly id: string
  public readonly aggregateId: string
  public readonly occurredAt: Date

  constructor(id: string, aggregateId: string, occurredAt: Date) {
    this.id = id
    this.aggregateId = aggregateId
    this.occurredAt = occurredAt
  }
}

export class PuzzleStatIncremented extends StatEvent {
  public readonly puzzleName: string

  constructor(id: string, aggregateId: string, occurredAt: Date, puzzleName: string) {
    super(id, aggregateId, occurredAt)
    this.puzzleName = puzzleName
  }
}
