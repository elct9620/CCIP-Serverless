import { Announcement } from '../../src/announcement'
import { Attendee } from '../../src/attendee'
import { Ruleset } from '../../src/event'

export interface AnnouncementRepository {
  listAll(): Promise<Announcement[]>
}

export interface AttendeeRepository {
  findByToken(token: string): Promise<Attendee | null>
  save(attendee: Attendee): Promise<void>
}

export interface RulesetRepository {
  findByEventId(eventId: string, name: string): Promise<Ruleset | null>
}
