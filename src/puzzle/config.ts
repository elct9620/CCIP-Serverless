import { Entity } from '@/core'

export class Config implements Entity<string> {
  readonly id: string
  private _pieces: Record<string, number>

  constructor(id: string, pieces: string) {
    this.id = id
    this._pieces = JSON.parse(pieces)
  }

  get pieces(): Record<string, number> {
    return this._pieces
  }
}
