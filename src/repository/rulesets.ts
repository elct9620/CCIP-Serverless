import { type D1Database } from '@cloudflare/workers-types'
import { Ruleset, Scenario, ScenarioConditionType, Condition } from '../model'

type RulesetSchema = {
	event_id: string
	name: string
	scenarios: string
}

type ConditionSchema = {
	type: string
	args: any[]
	reason?: string
}

type ScenarioSchema = {
	order: number
	display_text: string
	conditions: Record<string, ConditionSchema>
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

		let scenarios: Record<string, ScenarioSchema>
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
			const scenario = buildScenario(scenarios[scenarioId])
			ruleset.addScenario(scenarioId, scenario)
		}

		return ruleset
	}
}

function buildScenario(data: Record<string, any>): Scenario {
	const scenario = new Scenario({
		order: data.order,
		displayText: data.display_text,
	})

	for (const conditionType in data.conditions) {
		scenario.setCondition(
			conditionType as ScenarioConditionType,
			new Condition(
				data.conditions[conditionType].type,
				data.conditions[conditionType].args,
				data.conditions[conditionType].reason
			)
		)
	}

	return scenario
}
