import { AttendeeRepository, RulesetRepository } from './repository'
import { runRuleset } from '../../src/service'
import { Attendee } from '../../src/attendee'
import { Ruleset, Scenario } from '../../src/event'

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
	scenario?: Record<string, AttendeeScenario>
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

		return {
			eventId: attendee.eventId,
			displayName: attendee.displayName,
			firstUsedAt: attendee.firstUsedAt,
			role: attendee.role,
			metadata: attendee.metadata,
		}
	}
}
