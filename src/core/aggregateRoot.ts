import { Entity } from './entity'
import { DomainEvent } from './domainEvent'

export abstract class AggregateRoot<ID, E extends DomainEvent> implements Entity<ID> {
  public readonly id: ID
  private _domainEvents: E[] = []
  private _version: number = -1

  constructor(id: ID) {
    this.id = id
  }

  public get domainEvents(): E[] {
    return [...this._domainEvents]
  }

  protected addDomainEvent(event: E): void {
    this._domainEvents.push(event)
    this._version++
  }

  public clearEvents(): void {
    this._domainEvents = []
  }

  public get version(): number {
    return this._version
  }

  public setVersion(version: number): void {
    this._version = version
  }

  public apply(event: E): void {
    this.addDomainEvent(event)
  }
}

export abstract class EsAggregateRoot<ID, E extends DomainEvent> extends AggregateRoot<ID, E> {
  constructor(id: ID, events?: E[]) {
    super(id)

    if (events) {
      throw new Error(
        'Call replayEvents and clearEvents method in subclass to restore state from events'
      )
    }
  }

  protected replayEvents(events: E[]): void {
    events.forEach(event => this.apply(event))
  }

  public apply(event: E): void {
    this.when(event)
    super.apply(event)
  }

  abstract when(event: E): void
}
