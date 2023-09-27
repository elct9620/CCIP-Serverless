import { Announcement } from '@/announcement'

export interface AnnouncementRepository {
  create(announcement: Announcement): Promise<void>
}
