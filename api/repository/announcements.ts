import { type D1Database } from '@cloudflare/workers-types'
import { Announcement } from '../../src/announcement'

type AnnouncementSchema = {
  announced_at: string
  message_en: string
  message_zh: string
  uri: string
}

export class D1AnnouncementRepository {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async findByToken(token?: string): Promise<Announcement[]> {
    const stmt = this.db.prepare('SELECT * FROM announcements ORDER BY rowid')
    const { results } = await stmt.bind().all<AnnouncementSchema>()

    return results.map(
      result =>
        new Announcement({
          announcedAt: new Date(result.announced_at),
          messageEn: result.message_en,
          messageZh: result.message_zh,
          uri: result.uri,
        })
    )
  }
}
