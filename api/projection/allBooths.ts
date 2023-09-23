import { type D1Database } from '@cloudflare/workers-types'
import { Projection } from '@/core'
import { Booth } from '@/event'

export class D1AllBoothProjection implements Projection<void, Booth[]> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async query(): Promise<Booth[]> {
    return [new Booth('1', 'COSCUP'), new Booth('2', 'SITCON')]
  }
}
