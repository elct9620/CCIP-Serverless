import { EsAggregateRoot, getCurrentTime } from '@/core'
import { ActivityEvent, AttendeeInitialized } from './event'
import { Piece } from './piece'

type EventHandler = (this: Status, event: ActivityEvent) => void
export class Status extends EsAggregateRoot<string, ActivityEvent> {
  static eventHandlers: { [key: string]: EventHandler } = {
    AttendeeInitialized: function (this: Status, event: ActivityEvent) {
      this._displayName = (event as AttendeeInitialized).displayName
    },
  }

  private _displayName?: string
  private _pieces: Piece[] = []
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
    this.apply(new AttendeeInitialized(crypto.randomUUID(), this.id, getCurrentTime(), name))
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

  get pieces(): Piece[] {
    return [...this._pieces]
  }

  when(event: ActivityEvent): void {
    const handler: EventHandler = Status.eventHandlers[event.constructor.name]
    if (handler) {
      handler.call(this, event)
    }
  }
}
