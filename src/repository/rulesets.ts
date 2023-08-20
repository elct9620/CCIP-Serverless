import { type D1Database } from '@cloudflare/workers-types'
import { Ruleset } from '../entity'

type RulesetSchema = {
	event_id: string
	name: string
	scenarios: string
}

export class D1RulesetRepository {
	private readonly db: D1Database

	constructor(db: D1Database) {
		this.db = db
	}

	async findByEventId(eventId: string, name: string): Promise<Ruleset | null> {
		const stmt = await this.db.prepare('SELECT * FROM rulesets WHERE event_id = ? AND name = ?')
		const result = await stmt.bind(eventId, name).first<RulesetSchema>()

		if (!result) {
			return null
		}

		let scenarios: Record<string, any>
		try {
			scenarios = JSON.parse(result.scenarios)
		} catch (e) {
			scenarios = {}
		}

		return new Ruleset({
			eventId: result.event_id,
			name: result.name,
			scenarios,
		})
	}
}
