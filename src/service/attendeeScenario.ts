import { Attendee, Ruleset, Scenario } from '../entity'

type ValueMatchCondition = {
	key: string
	value: string
}

export function buildAttendeeScenario(attendee: Attendee, ruleset: Ruleset): Record<string, any> {
	let scenarios: Record<string, any> = {}

	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]

		const skipForAttendee = !isAttendeeMatchCondition(attendee, scenario.showCondition)
		if (skipForAttendee) {
			continue
		}

		scenarios[scenarioId] = {
			order: scenario.order,
			displayText: scenario.displayText,
		}
	}

	return scenarios
}

const isAttendeeMatchCondition = (
	attendee: Attendee,
	condition: ValueMatchCondition | null
): boolean => {
	if (!condition) {
		return true
	}

	return attendee.getMetadata(condition.key) === condition.value
}
