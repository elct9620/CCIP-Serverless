import { IRequest, json } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateAnnouncementPayload = {
  id: number
  announced_at: number
  message_en: string
  message_zh: string
  uri: string
  roles: string
}

export const createAnnouncementHandler = async (req: IRequest, { DB }: Env) => {
  const { id, announced_at, message_en, message_zh, uri, roles } =
    (await req.json()) as CreateAnnouncementPayload
  const stmt = DB.prepare(
    'INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const info = await stmt.bind(id, announced_at, message_en, message_zh, uri, roles).run()

  return json(info)
}
