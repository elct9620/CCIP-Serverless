import { Attendee, Ruleset, Scenario } from '../model'

type ValueMatchCondition = {
	key: string
	value: string
}

export function unlockScenarios(attendee: Attendee, ruleset: Ruleset): void {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const isUnlockable = isAttendeeMatchCondition(attendee, scenario.unlockCondition, false)
		if (scenario.isLocked && isUnlockable) {
			scenario.unlock()
		}
	}
}

export function hideScenarios(attendee: Attendee, ruleset: Ruleset) {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const isVisible = isAttendeeMatchCondition(attendee, scenario.showCondition)
		if (!isVisible) {
			scenario.hide()
		}
	}
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
