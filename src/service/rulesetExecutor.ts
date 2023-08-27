import { Attendee } from '../attendee'
import { Condition, ConditionType, Ruleset, Scenario, ScenarioConditionType } from '../event'
import { executeCondition } from './conditions'

export async function runRuleset(attendee: Attendee, ruleset: Ruleset | null) {
	if (!ruleset) {
		return
	}

	await copyMetadata(attendee, ruleset)
	await hideScenarios(attendee, ruleset)
	await unlockScenarios(attendee, ruleset)
}

export async function copyMetadata(attendee: Attendee, ruleset: Ruleset) {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const metadata = scenario.metadataDefinition

		const usedTime = attendee.getScenarioUsedTime(scenarioId)
		if (usedTime) {
			scenario.useAt(usedTime)
		}

		for (const key in metadata) {
			const template = metadata[key]
			const value = attendee.getMetadata(template.key)
			if (value) {
				scenario.setMetadata(key, value)
			}
		}
	}
}

export async function unlockScenarios(attendee: Attendee, ruleset: Ruleset) {
	for (const scenarioId in ruleset.scenarios) {
		const scenario = ruleset.scenarios[scenarioId]
		const condition = scenario.conditionsOf(ScenarioConditionType.Unlock)

		try {
			await executeCondition(attendee, condition)
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
			await executeCondition(attendee, condition)
		} catch (e: any) {
			scenario.hide()
		}
	}
}
