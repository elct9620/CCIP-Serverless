import { injectable, inject } from 'tsyringe'
import { type D1Database } from '@cloudflare/workers-types'
import { Projection } from '@/core'
import { Booth } from '@/event'

export type ListBoothInput = {
  eventId: string
}

type BoothSchema = {
  token: string
  eventId: string
  name: string
}

@injectable()
export class D1AllBoothProjection implements Projection<ListBoothInput, Booth[]> {
  constructor(
    @inject('database')
    private readonly db: D1Database
  ) {}

  async query({ eventId }: ListBoothInput): Promise<Booth[]> {
    const stmt = this.db.prepare('SELECT * FROM booths WHERE event_id = ?')
    const { results } = await stmt.bind(eventId).all<BoothSchema>()

    return results.map(row => new Booth(row.token, row.name))
  }
}
