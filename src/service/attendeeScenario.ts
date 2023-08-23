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
		const condition = scenario.conditionsOf(ScenarioConditionType.Unlock)

		try {
			await executeConditions(attendee, condition)
			scenario.unlock()
		} catch (e: any) {
			scenario.lock((e as Error).message)
		}
	}
}

export async function hideScenarios(attendee: Attendee, ruleset: Ruleset) {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const condition = scenario.conditionsOf(ScenarioConditionType.Visible)

		try {
			await executeConditions(attendee, condition)
		} catch (e: any) {
			scenario.hide()
		}
	}
}

async function executeConditions(attendee: Attendee, condition: Condition): Promise<void> {
	const handler = getConditionHandler(condition.type)
	if (!handler) {
		throw new Error(`Unknown condition type: ${condition.type}`)
	}

	if (handler(attendee, ...condition.args)) {
		return
	}

	throw new Error(condition.reason ?? '')
}
