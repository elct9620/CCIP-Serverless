import { type D1Database } from '@cloudflare/workers-types'
import { Announcement } from '../../src/announcement'

type AnnouncementSchema = {
  announced_at: number
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
    const stmt = this.db.prepare('SELECT * FROM Announcement WHERE role = ? ORDER BY rowid')
    const role = 'audience'
    const { results } = await stmt.bind(role).all<AnnouncementSchema>()

    return results.map(
      result =>
        new Announcement({
          announcedAt: result.announced_at,
          messageEn: result.message_en,
          messageZh: result.message_zh,
          uri: result.uri,
        })
    )
  }
}
