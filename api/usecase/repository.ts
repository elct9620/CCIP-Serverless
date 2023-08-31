import { Announcement } from '@/announcement'
import { Attendee } from '@/attendee'
import { Ruleset } from '@/event'

export interface AnnouncementRepository {
  listByRole(role: string): Promise<Announcement[]>
}

export interface AttendeeRepository {
  findByToken(token: string): Promise<Attendee | null>
  save(attendee: Attendee): Promise<void>
}

export interface RulesetRepository {
  findByEventId(eventId: string, name: string): Promise<Ruleset | null>
}
