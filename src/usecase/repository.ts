import { Attendee } from '../entity'

export interface AttendeeRepository {
	FindByToken(token: string): Promise<Attendee | null>
}
