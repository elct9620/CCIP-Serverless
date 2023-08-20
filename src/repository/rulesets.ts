import { type D1Database } from '@cloudflare/workers-types'
import { Ruleset } from '../entity'

export class D1RulesetRepository {
	private readonly db: D1Database

	constructor(db: D1Database) {
		this.db = db
	}

	async findByEventId(eventId: string, name: string): Promise<Ruleset | null> {
		return null
	}
}
