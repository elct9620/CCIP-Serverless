import { type D1Database } from '@cloudflare/workers-types'
import { Repository } from '@/core'
import { Config } from '@/puzzle'

export class D1PuzzleConfigRepository implements Repository<Config> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findById(eventId: string): Promise<Config | null> {
    return new Config(eventId, '{"=":1}')
  }

  async save(_config: Config): Promise<void> {}

  async delete(_config: Config): Promise<void> {}
}
