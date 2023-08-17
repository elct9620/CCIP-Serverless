import { AttendeeRepository } from './repository';

export interface AttendeeReply {
	nickname: string;
}

export class AttendeeInfo {
	private readonly attendeeRepository: AttendeeRepository;

	constructor(attendeeRepository: AttendeeRepository) {
		this.attendeeRepository = attendeeRepository;
	}

	public async GetAttendee(token: string): Promise<AttendeeReply | null> {
		const attendee = await this.attendeeRepository.FindByToken(token);

		if (!attendee) {
			return null
		}

		return {
			nickname: attendee.userId
		}
	}
}
