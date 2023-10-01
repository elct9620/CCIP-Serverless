import { IRequest, json } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateAnnouncementPayload = {
  id: string
  announced_at: number
  message_en: string
  message_zh: string
  uri: string
  roles: string[]
}

export const createAnnouncementHandler = async (req: IRequest, { DB }: Env) => {
  const stmt = DB.prepare(
    'INSERT INTO announcements (id, announced_at, message, uri, roles) VALUES (?, ?, ?, ?, ?)'
  )
  const payload = await req.json<CreateAnnouncementPayload | CreateAnnouncementPayload[]>()
  const payloadArray = Array.isArray(payload) ? payload : [payload]
  const info = await DB.batch(
    payloadArray.map(data =>
      stmt.bind(
        data.id,
        data.announced_at,
        JSON.stringify({
          'en-US': data.message_en,
          'zh-TW': data.message_zh,
        }),
        data.uri,
        JSON.stringify(data.roles)
      )
    )
  )

  return json(info)
}
