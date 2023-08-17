import { error, json, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import { UnstableDevWorker } from 'wrangler'

type Env = {
	DB: D1Database
}

export async function resetHandler(req: IRequest, { DB }: Env) {
	await DB.prepare(`DELETE FROM attendees`).run()
	await DB.prepare(`VACUUM`).run()

	return json({ message: 'ok' })
}

export async function reset(worker: UnstableDevWorker) {
	await worker.fetch('https://testability.opass.app/reset', { method: 'POST' })
}
