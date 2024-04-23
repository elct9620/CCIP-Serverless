import { inject, injectable } from 'tsyringe'
import { type D1Database } from '@cloudflare/workers-types'
import { Projection } from '@/core'
import { Announcement, LocalizedText } from '@/announcement'

type AnnouncementSchema = {
  id: string
  announced_at: string
  message: string
  uri: string
  roles: string
}

export type ListAnnouncementsInput = {
  role: string
}

@injectable()
export class D1ListAnnouncementsByAttendee
  implements Projection<ListAnnouncementsInput, Announcement[]>
{
  constructor(@inject('database') private readonly db: D1Database) {}

  async query({ role }: ListAnnouncementsInput): Promise<Announcement[] | null> {
    if (!role) {
      return []
    }

    const stmt = this.db.prepare(`
      SELECT * FROM announcements
        WHERE (
          SELECT 1 FROM json_each(roles) WHERE json_each.value = ?
        )
        ORDER BY announced_at DESC
      `)
    const { results } = await stmt.bind(role).all<AnnouncementSchema>()

    return results.map(toAnnouncement)
  }
}

const toAnnouncement = (data: AnnouncementSchema): Announcement => {
  let message: LocalizedText
  try {
    message = JSON.parse(data.message)
  } catch {
    message = {}
  }

  let roles: string[]
  try {
    roles = JSON.parse(data.roles)
  } catch {
    roles = []
  }

  return new Announcement({
    id: data.id,
    announcedAt: new Date(data.announced_at),
    message,
    uri: data.uri,
    roles,
  })
}
