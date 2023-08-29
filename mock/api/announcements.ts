import { json, IRequest } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateAnnouncementPayload = {
  /**
   * string in datetime format
   */
  announced_at: string
  message_en: string
  message_zh: string
  uri: string
};

export async function createAnnouncementHandler(req: IRequest, { DB }: Env) {
  const { announced_at, message_en, message_zh, uri } = (await req.json()) as CreateAnnouncementPayload
  const stmt = DB.prepare(
    'INSERT INTO announcements (announced_at, message_en, message_zh, uri) VALUES (?, ?, ?, ?)'
  )
  const info = await stmt
    .bind(
      announced_at,
      message_en,
      message_zh,
      uri
    )
    .run()

  return json(info)
}
