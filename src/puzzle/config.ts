import { Entity } from '@/core'

export class Config implements Entity<string> {
  readonly id: string
  private _pieces: Record<string, number>

  constructor(id: string) {
    this.id = id
    this._pieces = {}
  }

  get pieces(): Record<string, number> {
    return { ...this._pieces }
  }

  addPiece(name: string, ratio: number): void {
    this._pieces[name] = ratio
  }
}
