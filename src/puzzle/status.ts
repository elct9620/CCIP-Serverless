import { AggregateRoot, Replayable, getCurrentTime } from '@/core'
import { ActivityEvent, AttendeeInitialized, PuzzleCollected, Revoked } from './event'
import { Piece } from './piece'

@Replayable
export class Status extends AggregateRoot<string, ActivityEvent> {
  private _displayName?: string
  private _pieces: Piece[] = []
  private _revokedAt?: Date
  private _completedAt?: Date
  private _redeemedAt?: Date

  constructor(id: string, _events?: ActivityEvent[]) {
    super(id)
  }

  isNew(): boolean {
    return this.version == -1
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

  revoke(): void {
    this.apply(new Revoked(crypto.randomUUID(), this.id, getCurrentTime()))
  }

  collectPiece(name: string, giverName: string): void {
    this.apply(new PuzzleCollected(crypto.randomUUID(), this.id, getCurrentTime(), name, giverName))
  }

  isDeliveredBy(giverName: string): boolean {
    return this._pieces.some(piece => piece.giverName == giverName)
  }

  private _onAttendeeInitialized(event: AttendeeInitialized): void {
    this._displayName = event.displayName
  }

  private _onPuzzleCollected(event: PuzzleCollected): void {
    const { pieceName, giverName, occurredAt } = event
    const piece = new Piece(pieceName)
    piece.giveBy(giverName, occurredAt)
    this._pieces.push(piece)
  }

  private _onRevoked(event: Revoked) {
    this._revokedAt = new Date(event.occurredAt)

    if (!this._completedAt) {
      this._completedAt = this._revokedAt
    }
  }
}
