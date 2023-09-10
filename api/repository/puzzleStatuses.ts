import { type D1Database } from '@cloudflare/workers-types'
import { Status, ActivityEvent, AttendeeInitialized } from '@/puzzle'

type EventSchema = {
  id: string
  type: string
  aggregate_id: string
  version: number
  payload: string
  occurred_at: Date
}

export class D1PuzzleStatusRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async getStatus(token: string): Promise<Status | null> {
    const { results } = await this.db
      .prepare('SELECT * FROM puzzle_activity_events WHERE aggregate_id = ?')
      .bind(token)
      .all<EventSchema>()

    const events = results
      .sort((a, b) => a.version - b.version)
      .map(event => buildDomainEvent(event))
      .filter<ActivityEvent>((event): event is ActivityEvent => event != null)

    return new Status(token, events)
  }
}

function buildDomainEvent(event: EventSchema): ActivityEvent | null {
  if (event.type != 'AttendeeInitialized') return null

  const args = JSON.parse(event.payload) as string[]
  return new AttendeeInitialized(event.id, event.aggregate_id, event.occurred_at, args[0])
}
