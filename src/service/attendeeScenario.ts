import {
	Attendee,
	Condition,
	ConditionType,
	Ruleset,
	Scenario,
	ScenarioConditionType,
} from '../model'
import { getConditionHandler } from './conditions'

export async function unlockScenarios(attendee: Attendee, ruleset: Ruleset) {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const conditions = scenario.conditionsOf(ScenarioConditionType.Unlock)

		try {
			await executeConditions(attendee, conditions)
			scenario.unlock()
		} catch (e: any) {
			scenario.lock((e as Error).message)
		}
	}
}

export async function hideScenarios(attendee: Attendee, ruleset: Ruleset) {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const conditions = scenario.conditionsOf(ScenarioConditionType.Visible)

		try {
			await executeConditions(attendee, conditions, true)
		} catch (e: any) {
			scenario.hide()
		}
	}
}

async function executeConditions(
	attendee: Attendee,
	conditions: Condition[],
	defaultValue: boolean = false
): Promise<void> {
	for (const condition of conditions) {
		const conditionFn = getConditionHandler(condition.type, defaultValue)

		if (conditionFn(attendee, ...condition.args)) {
			return
		} else {
			throw new Error(condition.reason)
		}
	}
}
