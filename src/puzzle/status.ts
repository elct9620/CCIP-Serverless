import { EsAggregateRoot, getCurrentTime } from '@/core'
import { ActivityEvent, AttendeeInitialized, PuzzleCollected } from './event'
import { Piece } from './piece'

type EventHandler = (this: Status, event: ActivityEvent) => void
export class Status extends EsAggregateRoot<string, ActivityEvent> {
  static eventHandlers: { [key: string]: EventHandler } = {
    AttendeeInitialized: function (this: Status, event: ActivityEvent) {
      this._displayName = (event as AttendeeInitialized).displayName
    },
    PuzzleCollected: function (this: Status, event: ActivityEvent) {
      const { pieceName, giverName, occurredAt } = event as PuzzleCollected
      const piece = new Piece(pieceName)
      piece.giveBy(giverName, occurredAt)
      this._pieces = this._pieces || []
      this._pieces.push(piece)
    },
  }

  private _displayName?: string
  private _pieces: Piece[] = []
  private _revokedAt?: Date
  private _completedAt?: Date
  private _redeemedAt?: Date

  constructor(id: string, events?: ActivityEvent[]) {
    super(id)

    if (events) {
      this.replayEvents(events)
      this.clearEvents()
    }
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

  collectPiece(name: string, giverName: string): void {
    this.apply(new PuzzleCollected(crypto.randomUUID(), this.id, getCurrentTime(), name, giverName))
  }

  when(event: ActivityEvent): void {
    const handler: EventHandler = Status.eventHandlers[event.constructor.name]
    if (!handler) {
      throw new Error(`No event handler for ${event.constructor.name}`)
    }

    handler.call(this, event)
  }
}
