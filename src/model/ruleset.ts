import { Scenario } from './scenario'

export type RulesetAttribute = {
	eventId: string
	name: string
}

export class Ruleset {
	public readonly eventId: string
	public readonly name: string
	public readonly scenarios: Record<string, Scenario>

	constructor(attributes: RulesetAttribute) {
		this.eventId = attributes.eventId
		this.name = attributes.name
		this.scenarios = {}
	}

	addScenario(scenario: Scenario) {
		this.scenarios[scenario.id] = scenario
	}
}
