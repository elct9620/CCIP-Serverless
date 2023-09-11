import { ValueObject } from '@/core'

export class Piece implements ValueObject {
  public readonly name: string

  private _giverName?: string
  private _receivedAt?: Date

  constructor(name: string) {
    this.name = name
  }

  public get giverName(): string | null {
    return this._giverName || null
  }

  public get receivedAt(): Date | null {
    return this._receivedAt || null
  }

  public get isReceived(): boolean {
    return !!this._giverName && !!this._receivedAt
  }

  public giveBy(name: string, time: Date): void {
    this._giverName = name
    this._receivedAt = time
  }
}
