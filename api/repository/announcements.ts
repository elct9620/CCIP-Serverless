import { type D1Database } from '@cloudflare/workers-types'
import { Announcement } from '@/announcement'

export class D1AnnouncementRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async create(announcement: Announcement): Promise<void> {
    const { id, announcedAt, messageEn, messageZh, uri, roles } = announcement
    const stmt = this.db.prepare(`
      INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    await stmt
      .bind(id, announcedAt.toISOString(), messageEn, messageZh, uri, JSON.stringify(roles))
      .run()
  }
}
