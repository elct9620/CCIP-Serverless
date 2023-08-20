import { AttendeeRepository, RulesetRepository } from './repository'
import { buildAttendeeScenario } from '../service'

export interface AttendeeReply {
	eventId: string
	displayName: string
	firstUsedAt: Date | null
	role: string
	scenario: Record<string, any>
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

		let scenario: Record<string, any> = {}
		const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
		if (ruleset) {
			scenario = buildAttendeeScenario(attendee, ruleset)
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
			scenario,
		}
	}
}
