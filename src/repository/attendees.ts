import { type D1Database } from '@cloudflare/workers-types'
import { Attendee, AttendeeRole } from '../entity'

type AttendeeSchema = {
	token: string
	event_id: string
	display_name: string
	role: string
	first_used_at?: string
	metadata?: string
}

export class D1AttendeeRepository {
	private readonly db: D1Database

	constructor(db: D1Database) {
		this.db = db
	}

	async findByToken(token: string): Promise<Attendee | null> {
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

		return new Attendee({
			token: result.token,
			eventId: result.event_id,
			displayName: result.display_name,
			role: result.role === 'staff' ? AttendeeRole.Staff : AttendeeRole.Audience,
			firstUsedAt: result.first_used_at ? new Date(result.first_used_at) : undefined,
			metadata: metadata,
		})
	}

	async save(attendee: Attendee): Promise<void> {
		const stmt = this.db.prepare('UPDATE attendees SET first_used_at = ? WHERE token = ?')
		await stmt.bind(attendee.firstUsedAt?.toISOString(), attendee.token).run()
	}
}
