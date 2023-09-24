import { Announcement } from '@/announcement'
import { Ruleset, Booth } from '@/event'

export interface AnnouncementRepository {
  create(params: any): Promise<void>
  listByRole(role: string): Promise<Announcement[]>
}

export interface RulesetRepository {
  findByEventId(eventId: string, name: string): Promise<Ruleset | null>
}

export interface BoothRepository {
  listAll(): Promise<Booth[]>
}
