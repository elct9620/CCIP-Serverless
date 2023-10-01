import { IRequest, json } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateAnnouncementPayload = {
  id: string
  announced_at: number
  message: string
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
        JSON.stringify(data.message),
        data.uri,
        JSON.stringify(data.roles)
      )
    )
  )

  return json(info)
}
