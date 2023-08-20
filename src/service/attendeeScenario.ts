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

		let disableReason = scenario.isLocked ? scenario.lockReason : null
		const isUnlocked = isAttendeeMatchCondition(attendee, scenario.unlockCondition, false)
		if (isUnlocked) {
			disableReason = null
		}

		scenarios[scenarioId] = {
			order: scenario.order,
			displayText: scenario.displayText,
			disableReason,
		}
	}

	return scenarios
}

const isAttendeeMatchCondition = (
	attendee: Attendee,
	condition: ValueMatchCondition | null,
	defaultValue: boolean = true
): boolean => {
	if (!condition) {
		return defaultValue
	}

	return attendee.getMetadata(condition.key) === condition.value
}
