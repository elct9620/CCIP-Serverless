import { type D1Database } from '@cloudflare/workers-types'
import { type Class } from '@/core/utils'
import { Repository } from '@/core'
import { Status, ActivityEvent, AttendeeInitialized, PuzzleCollected } from '@/puzzle'

type EventSchema = {
  id: string
  type: string
  aggregate_id: string
  version: number
  payload: string
  occurred_at: Date
}

const eventConstructors: Record<string, Class<ActivityEvent>> = {
  AttendeeInitialized: AttendeeInitialized,
  PuzzleCollected: PuzzleCollected,
}

export class D1PuzzleStatusRepository implements Repository<Status> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findById(token: string): Promise<Status | null> {
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

  async save(_status: Status): Promise<void> {}

  async delete(_status: Status): Promise<void> {}
}

function buildDomainEvent(event: EventSchema): ActivityEvent | null {
  const klass = eventConstructors[event.type]
  if (!klass) {
    return null
  }

  const domainEvent = Object.create(klass.prototype)

  const payload = JSON.parse(event.payload) as object
  const properties = {
    id: event.id,
    aggregateId: event.aggregate_id,
    occurredAt: event.occurred_at,
    ...payload,
  }
  Object.assign(domainEvent, properties)

  return domainEvent
}
