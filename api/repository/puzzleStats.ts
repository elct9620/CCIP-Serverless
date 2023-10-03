import { type D1Database } from '@cloudflare/workers-types'
import { Repository } from '@/core'
import { Stats } from '@/puzzle'

export class D1PuzzleStatsRepository implements Repository<Stats> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findById(_id: string): Promise<Stats | null> {
    return null
  }

  async save(_stats: Stats): Promise<void> {
    return
  }

  async delete(_stats: Stats): Promise<void> {
    return
  }
}
