import { error, json, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import { UnstableDevWorker } from 'wrangler'

type Env = {
	DB: D1Database
}

export type CreateAttendeePayload = {
	token: string
	user_id: string
}

export async function createAttendeeHandler(req: IRequest, { DB }: Env) {
	const { token, user_id } = (await req.json()) as CreateAttendeePayload
	const stmt = await DB.prepare(`INSERT INTO attendees (token, user_id) VALUES (?, ?)`)
	const info = await stmt.bind(token, user_id).run()

	return json(info)
}

export async function createAttendee(worker: UnstableDevWorker, payload: CreateAttendeePayload) {
	await worker.fetch('https://testability.opass.app/attendees', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload),
	})
}
