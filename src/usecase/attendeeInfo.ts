import { AttendeeRepository } from './repository'

export interface AttendeeReply {
	displayName: string
	firstUsedAt: Date | null
	role: string
}

export class AttendeeInfo {
	private readonly attendeeRepository: AttendeeRepository

	constructor(attendeeRepository: AttendeeRepository) {
		this.attendeeRepository = attendeeRepository
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
			displayName: attendee.displayName,
			firstUsedAt: attendee.firstUsedAt,
			role: attendee.role,
		}
	}
}
