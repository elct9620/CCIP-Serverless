import { Announcement } from '@/announcement'
import { Attendee } from '@/attendee'
import { Ruleset } from '@/event'
import { Status as PuzzleStatus } from '@/puzzle'

export interface AnnouncementRepository {
  create(params: any): Promise<void>
  listByRole(role: string): Promise<Announcement[]>
}

export interface AttendeeRepository {
  findByToken(token: string): Promise<Attendee | null>
  save(attendee: Attendee): Promise<void>
}

export interface RulesetRepository {
  findByEventId(eventId: string, name: string): Promise<Ruleset | null>
}

export interface PuzzleStatusRepository {
  getStatus(token: string): Promise<PuzzleStatus | null>
}
