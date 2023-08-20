import { console, type D1Database } from '@cloudflare/workers-types'
import { Attendee } from '../entity'

type AttendeeSchema = {
	token: string
	display_name: string
	first_used_at?: string
}

export class D1AttendeeRepository {
	private db: D1Database

	constructor(db: D1Database) {
		this.db = db
	}

	async findByToken(token: string): Promise<Attendee | null> {
		const stmt = this.db.prepare('SELECT * FROM attendees WHERE token = ?')
		const result = await stmt.bind(token).first<AttendeeSchema>()

		if (!result) {
			return null
		}

		return new Attendee({
			token: result.token,
			displayName: result.display_name,
			firstUsedAt: result.first_used_at ? new Date(result.first_used_at) : undefined,
		})
	}

	async save(attendee: Attendee): Promise<void> {
		const stmt = this.db.prepare('UPDATE attendees SET first_used_at = ? WHERE token = ?')
		await stmt.bind(attendee.firstUsedAt?.toISOString(), attendee.token).run()
	}
}
