import { injectable, inject } from 'tsyringe'
import { type D1Database } from '@cloudflare/workers-types'
import { Repository } from '@/core'
import { Config } from '@/puzzle'

type PuzzleConfigSchema = {
  event_id: string
  pieces: string
}

@injectable()
export class D1PuzzleConfigRepository implements Repository<Config> {
  constructor(
    @inject('database')
    private readonly db: D1Database
  ) {}

  async findById(eventId: string): Promise<Config | null> {
    const stmt = await this.db
      .prepare('SELECT * FROM puzzle_configs WHERE event_id = ?')
      .bind(eventId)
    const result = await stmt.first<PuzzleConfigSchema>()

    if (!result) {
      return null
    }

    const config = new Config(result.event_id)
    const pieces = JSON.parse(result.pieces)

    for (const name in pieces) {
      config.addPiece(name, pieces[name])
    }

    return config
  }

  async save(_config: Config): Promise<void> {}

  async delete(_config: Config): Promise<void> {}
}
