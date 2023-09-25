import { IRequest, json } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateBoothPayload = {
  token: string
  name: string
  event_id: string
}

export const createBoothHandler = async (req: IRequest, { DB }: Env) => {
  const payload = await req.json<CreateBoothPayload | CreateBoothPayload[]>()
  const booths = Array.isArray(payload) ? payload : [payload]
  const stmt = DB.prepare('INSERT INTO booths (token, name, event_id) VALUES (?, ?, ?)')
  const res = await DB.batch(
    booths.map(booth => stmt.bind(booth.token, booth.name, booth.event_id))
  )

  return json(res)
}
