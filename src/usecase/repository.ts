import { Attendee } from '../entity'

export interface AttendeeRepository {
	findByToken(token: string): Promise<Attendee | null>
}
