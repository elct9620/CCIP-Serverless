import { Announcement } from '@/announcement'

export interface AnnouncementRepository {
  create(params: any): Promise<void>
  listByRole(role: string): Promise<Announcement[]>
}
