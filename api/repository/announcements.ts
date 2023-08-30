import { type D1Database } from '@cloudflare/workers-types'
import { Announcement } from '@/announcement'

type AnnouncementSchema = {
  announced_at: string
  message_en: string | null
  message_zh: string | null
  uri: string
}

export class D1AnnouncementRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findAll(): Promise<Announcement[]> {
    const stmt = this.db.prepare('SELECT * FROM Announcement ORDER BY rowid')
    const { results } = await stmt.all<AnnouncementSchema>()

    return results.map(toAnnouncement)
  }
}

const toAnnouncement = (data: AnnouncementSchema) =>
  new Announcement({
    announcedAt: new Date(data.announced_at),
    messageEn: data.message_en,
    messageZh: data.message_zh,
    uri: data.uri,
  })
