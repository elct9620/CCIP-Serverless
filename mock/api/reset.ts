import { json, IRequest } from 'itty-router'
import { D1Database } from '@cloudflare/workers-types'

type Env = {
  DB: D1Database
}

export async function resetHandler(req: IRequest, { DB }: Env) {
  await DB.batch([
    DB.prepare('DELETE FROM announcements'),
    DB.prepare(`DELETE FROM attendees`),
    DB.prepare(`DELETE FROM rulesets`),
    DB.prepare(`DELETE FROM puzzle_activity_events`),
    DB.prepare(`DELETE FROM puzzle_stat_events`),
    DB.prepare(`DELETE FROM puzzle_configs`),
    DB.prepare(`DELETE FROM booths`),
  ])

  await DB.prepare(`VACUUM`).run()

  return json({ message: 'ok' })
}
