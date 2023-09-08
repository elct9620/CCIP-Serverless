import { type D1Database } from '@cloudflare/workers-types'
import { Status } from '@/puzzle'

export class D1PuzzleStatusRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async getStatus(token: string): Promise<Status | null> {
    return new Status(token)
  }
}
