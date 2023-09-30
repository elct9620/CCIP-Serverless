import { type D1Database } from '@cloudflare/workers-types'
import { Repository } from '@/core'
import { Attendee, AttendeeRole } from '../../src/attendee'

type AttendeeSchema = {
  token: string
  event_id: string
  display_name: string
  role: string
  first_used_at?: string
  metadata?: string
}

export class D1AttendeeRepository implements Repository<Attendee> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findById(token: string): Promise<Attendee | null> {
    const stmt = this.db.prepare('SELECT * FROM attendees WHERE token = ?')
    const result = await stmt.bind(token).first<AttendeeSchema>()

    if (!result) {
      return null
    }

    let metadata: Record<string, any>
    try {
      metadata = result.metadata ? JSON.parse(result.metadata) : {}
    } catch (e) {
      metadata = {}
    }

    const publicToken = await calculatePublicToken(token)

    return new Attendee({
      token: result.token,
      publicToken: publicToken,
      eventId: result.event_id,
      displayName: result.display_name,
      role: result.role === 'staff' ? AttendeeRole.Staff : AttendeeRole.Audience,
      firstUsedAt: result.first_used_at ? new Date(result.first_used_at) : undefined,
      metadata: metadata,
    })
  }

  async save(attendee: Attendee): Promise<void> {
    const stmt = this.db.prepare(
      'UPDATE attendees SET first_used_at = ?, metadata = ? WHERE token = ?'
    )
    await stmt
      .bind(
        attendee.firstUsedAt?.toISOString(),
        JSON.stringify(attendee.metadataWithHidden),
        attendee.token
      )
      .run()
  }

  async delete(attendee: Attendee): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM attendees WHERE token = ?')
    await stmt.bind(attendee.token).run()
  }
}

async function calculatePublicToken(token: string): Promise<string> {
  const uint8Token = new TextEncoder().encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-1', uint8Token)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
