import { type D1Database } from '@cloudflare/workers-types'
import { Announcement } from '@/announcement'

type AnnouncementSchema = {
  id: string
  announced_at: string
  message_en: string | null
  message_zh: string | null
  uri: string
  roles: string[]
}

export class D1AnnouncementRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async create(announcement: Record<string, unknown>): Promise<void> {
    const { id, announcedAt, messageEn, messageZh, uri, roles } = announcement
    const stmt = this.db.prepare(`
      INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    await stmt.bind(id, announcedAt, messageEn, messageZh, uri, JSON.stringify(roles)).run()
  }

  async listByRole(role: string): Promise<Announcement[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM announcements
        WHERE (
          SELECT 1 FROM json_each(roles) WHERE json_each.value = ?
        )
        ORDER BY id
      `)
    const { results } = await stmt.bind(role).all<AnnouncementSchema>()

    return results.map(toAnnouncement)
  }
}

const toAnnouncement = (data: AnnouncementSchema) =>
  new Announcement({
    id: data.id,
    announcedAt: new Date(data.announced_at),
    messageEn: data.message_en,
    messageZh: data.message_zh,
    uri: data.uri,
  })
