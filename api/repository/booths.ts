import { type D1Database } from '@cloudflare/workers-types'
import { Booth } from '@/event'

export class D1BoothRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async listAll(): Promise<Booth[]> {
    return [new Booth('1', 'COSCUP'), new Booth('2', 'SITCON')]
  }
}
