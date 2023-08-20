import { Attendee, Ruleset, Scenario } from '../entity'

type ValueMatchCondition = {
	key: string
	value: string
}

export function unlockScenarios(attendee: Attendee, ruleset?: Ruleset | null): void {
	if (!ruleset) {
		return
	}

	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const isUnlockable = isAttendeeMatchCondition(attendee, scenario.unlockCondition, false)
		if (scenario.isLocked && isUnlockable) {
			scenario.unlock()
		}
	}
}

export function filterVisibleScenarios(attendee: Attendee, ruleset?: Ruleset | null): Scenario[] {
	if (!ruleset) {
		return []
	}

	return Object.values(ruleset.scenarios).filter(scenario => {
		return isAttendeeMatchCondition(attendee, scenario.showCondition)
	})
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
