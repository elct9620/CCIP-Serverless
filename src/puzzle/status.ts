export type CollectedItem = {
  id: string
  deliverer: string
  collectedAt: Date
}

export class Status {
  public readonly token: string
  private _displayName?: string
  private _collectedItems: CollectedItem[] = []
  private _revokedAt?: Date
  private _completedAt?: Date
  private _redeemedAt?: Date

  constructor(token: string) {
    this.token = token
  }

  get displayName(): string {
    return this._displayName || ''
  }

  changeDisplayName(name: string): void {
    this._displayName = name
  }

  get isRevoked(): boolean {
    return !!this._revokedAt
  }

  revoke(time: Date): void {
    this._revokedAt = time
  }

  get completedAt(): Date | null {
    return this._completedAt || null
  }

  complete(time: Date): void {
    this._completedAt = time
  }

  get redeemedAt(): Date | null {
    return this._redeemedAt || null
  }

  redeem(time: Date): void {
    this._redeemedAt = time
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
}
