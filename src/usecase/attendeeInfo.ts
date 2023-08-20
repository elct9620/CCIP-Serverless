import { AttendeeRepository, RulesetRepository } from './repository'
import { filterVisibleScenarios, unlockScenarios } from '../service'
import { Scenario } from '../entity'

export type AttendeeScenario = {
	order: number
	displayText: Record<string, string>
	disableReason: string | null
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

		let scenarios: Scenario[] = []
		const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
		unlockScenarios(attendee, ruleset)

		if (touch) {
			attendee.touch()
			await this.attendeeRepository.save(attendee)
		}

		return {
			eventId: attendee.eventId,
			displayName: attendee.displayName,
			firstUsedAt: attendee.firstUsedAt,
			role: attendee.role,
			metadata: attendee.metadata,
			scenario: buildAttendeeScenario(filterVisibleScenarios(attendee, ruleset)),
		}
	}
}

function buildAttendeeScenario(scenarios: Scenario[]): Record<string, any> {
	let result: Record<string, any> = {}

	for (const scenario of scenarios) {
		result[scenario.id] = {
			order: scenario.order,
			displayText: scenario.displayText,
			disableReason: scenario.isLocked ? scenario.lockReason : null,
		}
	}

	return result
}
