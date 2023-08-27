import { Attendee, Ruleset } from '../../src/model'

export interface AttendeeRepository {
	findByToken(token: string): Promise<Attendee | null>
	save(attendee: Attendee): Promise<void>
}

export interface RulesetRepository {
	findByEventId(eventId: string, name: string): Promise<Ruleset | null>
}
