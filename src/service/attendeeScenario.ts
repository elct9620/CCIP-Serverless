import { Attendee, Ruleset } from '../entity'

export function buildAttendeeScenario(attendee: Attendee, ruleset: Ruleset): Record<string, any> {
	let scenarios: Record<string, any> = {}

	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]

		scenarios[scenarioId] = {
			order: scenario.order,
			displayText: scenario.displayText,
		}
	}

	return scenarios
}
