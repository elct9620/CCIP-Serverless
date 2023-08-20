import { AttendeeRepository } from './repository'

export interface AttendeeReply {
	nickname: string
	firstUsedAt: Date | null
}

export class AttendeeInfo {
	private readonly attendeeRepository: AttendeeRepository

	constructor(attendeeRepository: AttendeeRepository) {
		this.attendeeRepository = attendeeRepository
	}

	public async getAttendee(token: string): Promise<AttendeeReply | null> {
		const attendee = await this.attendeeRepository.findByToken(token)

		if (!attendee) {
			return null
		}

		return {
			nickname: attendee.userId,
			firstUsedAt: attendee.firstUsedAt,
		}
	}
}
