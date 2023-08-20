import { error, json, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import { UnstableDevWorker } from 'wrangler'

type Env = {
	DB: D1Database
}

export type CreateAttendeePayload = {
	token: string
	user_id: string
	first_used_at?: string
}

export async function createAttendeeHandler(req: IRequest, { DB }: Env) {
	const { token, user_id, first_used_at } = (await req.json()) as CreateAttendeePayload
	const stmt = await DB.prepare(
		`INSERT INTO attendees (token, user_id, first_used_at) VALUES (?, ?, ?)`
	)
	const info = await stmt.bind(token, user_id, first_used_at ?? null).run()

	return json(info)
}
