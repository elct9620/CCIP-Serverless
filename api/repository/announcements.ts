import { type D1Database } from '@cloudflare/workers-types'
import { Repository } from '@/core'
import { Announcement } from '@/announcement'
import container from '@/container'
import { database } from './database'

export class D1AnnouncementRepository implements Repository<Announcement> {
  private readonly db: D1Database

  constructor() {
    this.db = container.get(database)
  }

  async save(announcement: Announcement): Promise<void> {
    const { id, announcedAt, message, uri, roles } = announcement
    const stmt = this.db.prepare(`
      INSERT INTO announcements (id, announced_at, message, uri, roles)
        VALUES (?, ?, ?, ?, ?)
    `)
    await stmt
      .bind(id, announcedAt.toISOString(), JSON.stringify(message), uri, JSON.stringify(roles))
      .run()
  }

  async findById(_id: string): Promise<null> {
    return Promise.resolve(null)
  }

  async delete(_announcement: Announcement): Promise<void> {}
}
