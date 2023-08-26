import { AttendeeRepository, RulesetRepository } from './repository'
import { Scenario } from '../model'
import { runRuleset } from '../service'
import { getCurrentTime } from '../helper'

type ScenarioInfo = {
	order: number
	displayText: Record<string, string>
	locked: boolean
	lockReason: string
	metadata: Record<string, any>
}

type AttendeeScenario = Record<string, ScenarioInfo>

export class ScenarioNotFoundError extends Error {}
export class ScenarioNotAvailableError extends Error {}

export class AttendeeAccess {
	private readonly attendeeRepository: AttendeeRepository
	private readonly rulesetRepository: RulesetRepository

	constructor(attendeeRepository: AttendeeRepository, rulesetRepository: RulesetRepository) {
		this.attendeeRepository = attendeeRepository
		this.rulesetRepository = rulesetRepository
	}

	async getScenarios(token: string): Promise<AttendeeScenario> {
		const attendee = await this.attendeeRepository.findByToken(token)
		if (!attendee) {
			return {}
		}

		const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
		if (!ruleset) {
			return {}
		}

		await runRuleset(attendee, ruleset)

		return buildAttendeeScenario(ruleset.visibleScenarios)
	}

	async useScenario(token: string, scenarioId: string): Promise<AttendeeScenario> {
		const attendee = await this.attendeeRepository.findByToken(token)
		if (!attendee) {
			return {}
		}

		const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
		if (!ruleset) {
			return {}
		}

		await runRuleset(attendee, ruleset)

		const visibleScenarios = ruleset.visibleScenarios
		const scenario = visibleScenarios[scenarioId]
		if (!scenario) {
			throw new ScenarioNotFoundError('invalid scenario')
		}

		if (!scenario.isAvailableAt(getCurrentTime())) {
			throw new ScenarioNotAvailableError('link is expired or not available yet')
		}

		return buildAttendeeScenario(visibleScenarios)
	}
}

function buildAttendeeScenario(scenarios: Record<string, Scenario>): Record<string, ScenarioInfo> {
	let result: Record<string, ScenarioInfo> = {}

	for (const scenarioId in scenarios) {
		const scenario = scenarios[scenarioId]
		result[scenarioId] = {
			order: scenario.order,
			displayText: scenario.displayText,
			locked: scenario.isLocked,
			lockReason: scenario.lockReason,
			metadata: scenario.metadata,
		}
	}

	return result
}
