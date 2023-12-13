import { json, IRequest } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreatePuzzleConfigPayload = {
  event_id: string
  pieces: Record<string, number>
}

export async function createPuzzleConfigHandler(req: IRequest, { DB }: Env) {
  const { event_id, pieces } = (await req.json()) as CreatePuzzleConfigPayload
  const stmt = await DB.prepare(`INSERT INTO puzzle_configs (event_id, pieces) VALUES (?, ?)`)
  const info = await stmt.bind(event_id, pieces ? JSON.stringify(pieces) : '{}').run()

  return json(info)
}
