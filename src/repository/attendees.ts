import type { D1Database } from '@cloudflare/workers-types'
import { Attendee } from '../entity'

type AttendeeSchema = {
	token: string
	user_id: string
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

		return new Attendee(token, result.user_id)
	}
}
