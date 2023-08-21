import { type D1Database } from '@cloudflare/workers-types'
import { Ruleset, Scenario } from '../model'

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

		const ruleset = new Ruleset({
			eventId: result.event_id,
			name: result.name,
		})

		for (const scenarioId in scenarios) {
			const scenario = buildScenario(scenarioId, scenarios[scenarioId])
			ruleset.addScenario(scenario)
		}

		return ruleset
	}
}

function buildScenario(id: string, data: Record<string, any>): Scenario {
	return new Scenario({
		id,
		order: data.order,
		displayText: data.display_text,
		showCondition: data.show_condition,
		locked: data.locked,
		lockReason: data.lock_reason,
		unlockCondition: data.unlock_condition,
	})
}
