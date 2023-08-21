import { Attendee, ConditionType, Ruleset, Scenario, ScenarioConditionType } from '../model'

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
		const conditions = scenario.conditionsOf(ScenarioConditionType.Visible)
		const isVisible = conditions.reduce((acc, condition) => {
			if (condition.type != ConditionType.AttendeeAttribute) {
				return acc
			}

			return acc && isAttendeeAttributeMatchCondition(attendee, ...condition.args)
		}, true)

		if (!isVisible) {
			scenario.hide()
		}
	}
}

const isAttendeeAttributeMatchCondition = (attendee: Attendee, ...args: any[]): boolean => {
	return attendee.getMetadata(args[0] as string) === (args[1] as string)
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
