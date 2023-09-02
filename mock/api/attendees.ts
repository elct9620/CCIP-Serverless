import { json, IRequest } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateAttendeePayload = {
  token: string
  event_id: string
  display_name: string
  role?: string
  first_used_at?: string
  metadata?: string
}

export async function createAttendeeHandler(req: IRequest, { DB }: Env) {
  const { token, event_id, display_name, role, first_used_at, metadata } =
    (await req.json()) as CreateAttendeePayload
  const stmt = await DB.prepare(
    `INSERT INTO attendees (token, event_id, display_name, role, first_used_at, metadata) VALUES (?, ?, ?, ?, ?, ?)`
  )
  const info = await stmt
    .bind(
      token,
      event_id,
      display_name,
      role ?? 'audience',
      first_used_at ?? null,
      metadata ?? '{}'
    )
    .run()

  return json(info)
}
