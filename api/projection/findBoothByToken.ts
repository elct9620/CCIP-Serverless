import { type D1Database } from '@cloudflare/workers-types'
import { Projection } from '@/core'
import { Booth } from '@/event'

export type FindBoothByTokenInput = {
  token: string
}

type BoothSchema = {
  token: string
  eventId: string
  name: string
}

export class D1FindBoothByToken implements Projection<FindBoothByTokenInput, Booth> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async query({ token }: FindBoothByTokenInput): Promise<Booth | null> {
    const stmt = this.db.prepare('SELECT * FROM booths WHERE token = ?')
    const booth = await stmt.bind(token).first<BoothSchema>()

    if (!booth) {
      return null
    }

    return new Booth(booth.token, booth.name)
  }
}
