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

  async create(): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    const fixedValues = [
      crypto.randomUUID(),
      new Date('2023-08-27 00:00:00 GMT+8').toISOString(),
      'hello world',
      '世界你好',
      'https://testability.opass.app/announcements/1',
      '["audience"]',
    ]
    await stmt.bind(...fixedValues).run()
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
