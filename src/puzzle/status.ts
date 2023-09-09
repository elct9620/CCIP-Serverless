import { EsAggregateRoot } from '@/core'
import { ActivityEvent, AttendeeInitialized } from './event'

export type CollectedItem = {
  id: string
  deliverer: string
  collectedAt: Date
}

type EventHandler = (this: Status, event: ActivityEvent) => void
export class Status extends EsAggregateRoot<string, ActivityEvent> {
  static eventHandlers: { [key: string]: EventHandler } = {
    AttendeeInitialized: function (this: Status, event: ActivityEvent) {
      this._displayName = (event as AttendeeInitialized).displayName
    },
  }

  private _displayName?: string
  private _collectedItems: CollectedItem[] = []
  private _revokedAt?: Date
  private _completedAt?: Date
  private _redeemedAt?: Date

  constructor(token: string, events?: ActivityEvent[]) {
    super(token, events)
  }

  get displayName(): string {
    return this._displayName || ''
  }

  changeDisplayName(name: string): void {
    this.apply(new AttendeeInitialized(this.id, this.id, new Date(), name))
  }

  get isRevoked(): boolean {
    return !!this._revokedAt
  }

  get completedAt(): Date | null {
    return this._completedAt || null
  }

  get redeemedAt(): Date | null {
    return this._redeemedAt || null
  }

  get collectedItems(): CollectedItem[] {
    return this._collectedItems
  }

  collect(name: string, deliverBy: string, time: Date): void {
    this._collectedItems.push({
      id: name,
      deliverer: deliverBy,
      collectedAt: time,
    })
  }

  when(event: ActivityEvent): void {
    const handler: EventHandler = Status.eventHandlers[event.constructor.name]
    if (handler) {
      handler.call(this, event)
    }
  }
}
