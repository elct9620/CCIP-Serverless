import { type D1Database } from '@cloudflare/workers-types'
import { Repository } from '@/core'
import { Announcement, AnnouncementLocales } from '@/announcement'

export class D1AnnouncementRepository implements Repository<Announcement> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async save(announcement: Announcement): Promise<void> {
    const { id, announcedAt, message, uri, roles } = announcement
    const stmt = this.db.prepare(`
      INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    await stmt
      .bind(
        id,
        announcedAt.toISOString(),
        message[AnnouncementLocales.enUS],
        message[AnnouncementLocales.zhTW],
        uri,
        JSON.stringify(roles)
      )
      .run()
  }

  async findById(_id: string): Promise<null> {
    return Promise.resolve(null)
  }

  async delete(_announcement: Announcement): Promise<void> {}
}
