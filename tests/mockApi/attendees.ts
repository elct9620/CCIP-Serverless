import { error, json, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'

type Env = {
	DB: D1Database
}

export async function CreateAttendee(req: IRequest, { DB }: Env) {
	const { token, user_id } = await req.json()
	const stmt = await DB.prepare(`INSERT INTO attendees (token, user_id) VALUES (?, ?)`)
	const info = await stmt.bind(token, user_id).run()

	return json(info)
}
