import { IRequest, json } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateAnnouncementPayload = {
  announced_at: number
  message_en: string
  message_zh: string
  uri: string
}

export const createAnnouncementHandler = async (req: IRequest, { DB }: Env) => {
  const { announced_at, message_en, message_zh, uri } =
    (await req.json()) as CreateAnnouncementPayload
  const stmt = DB.prepare(
    'INSERT INTO announcements (announced_at, message_en, message_zh, uri) VALUES (?, ?, ?, ?)'
  )
  const info = await stmt.bind(announced_at, message_en, message_zh, uri).run()

  return json(info)
}
