import { Attendee } from '../entity'

export class D1AttendeeRepository {
	async FindByToken(token: string): Promise<Attendee> {
		return new Attendee(token, 'Aotoki')
	}
}
