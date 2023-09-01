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
  const stmt = DB.prepare(
    'INSERT INTO announcements (id, announced_at, message_en, message_zh, uri, roles) VALUES (?, ?, ?, ?, ?, ?)'
  )
  const payload = await req.json<CreateAnnouncementPayload | CreateAnnouncementPayload[]>()

  let info
  if (isPayloadInArray(payload)) {
    info = await DB.batch(
      payload.map(data =>
        stmt.bind(
          data.id,
          data.announced_at,
          data.message_en,
          data.message_zh,
          data.uri,
          data.roles
        )
      )
    )
  } else {
    info = await stmt
      .bind(
        payload.id,
        payload.announced_at,
        payload.message_en,
        payload.message_zh,
        payload.uri,
        payload.roles
      )
      .run()
  }

  return json(info)
}

const isPayloadInArray = (
  payload: CreateAnnouncementPayload | CreateAnnouncementPayload[]
): payload is CreateAnnouncementPayload[] => Array.isArray(payload)
