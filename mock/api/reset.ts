import { json, IRequest } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export async function resetHandler(req: IRequest, { DB }: Env) {
  await DB.prepare('DELETE FROM announcements').run()
  await DB.prepare(`DELETE FROM attendees`).run()
  await DB.prepare(`DELETE FROM rulesets`).run()
  await DB.prepare(`VACUUM`).run()

  return json({ message: 'ok' })
}
