import { AttendeeRepository, RulesetRepository } from './repository'
import { hideScenarios, unlockScenarios } from '../service'
import { Scenario } from '../model'

export type AttendeeScenario = {
	order: number
	displayText: Record<string, string>
	locked: boolean
	lockReason: string | null
}

export type AttendeeReply = {
	eventId: string
	displayName: string
	firstUsedAt: Date | null
	role: string
	scenario: Record<string, AttendeeScenario>
	metadata: Record<string, any>
}

export class AttendeeInfo {
	private readonly attendeeRepository: AttendeeRepository
	private readonly rulesetRepository: RulesetRepository

	constructor(attendeeRepository: AttendeeRepository, rulesetRepository: RulesetRepository) {
		this.attendeeRepository = attendeeRepository
		this.rulesetRepository = rulesetRepository
	}

	public async getAttendee(token: string, touch: boolean = false): Promise<AttendeeReply | null> {
		const attendee = await this.attendeeRepository.findByToken(token)
		if (!attendee) {
			return null
		}

		if (touch) {
			attendee.touch()
			await this.attendeeRepository.save(attendee)
		}

		const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
		if (ruleset) {
			await hideScenarios(attendee, ruleset)
			await unlockScenarios(attendee, ruleset)
		}

		return {
			eventId: attendee.eventId,
			displayName: attendee.displayName,
			firstUsedAt: attendee.firstUsedAt,
			role: attendee.role,
			metadata: attendee.metadata,
			scenario: buildAttendeeScenario(ruleset?.visibleScenarios || {}),
		}
	}
}

function buildAttendeeScenario(scenarios: Record<string, Scenario>): Record<string, any> {
	let result: Record<string, any> = {}

	for (const scenarioId in scenarios) {
		const scenario = scenarios[scenarioId]
		result[scenarioId] = {
			order: scenario.order,
			displayText: scenario.displayText,
			locked: scenario.isLocked,
			lockReason: scenario.lockReason,
		}
	}

	return result
}
