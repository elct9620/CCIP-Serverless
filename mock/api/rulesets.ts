import { json, IRequest } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export type CreateRulesetPayload = {
  event_id: string
  name: string
  scenarios?: Record<string, any>
}

export async function createRulesetHandler(req: IRequest, { DB }: Env) {
  const { event_id, name, scenarios } = (await req.json()) as CreateRulesetPayload
  const stmt = await DB.prepare(`INSERT INTO rulesets (event_id, name, scenarios) VALUES (?, ?, ?)`)
  const info = await stmt.bind(event_id, name, scenarios ? JSON.stringify(scenarios) : '{}').run()

  return json(info)
}
