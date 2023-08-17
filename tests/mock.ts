import { error, json, Router, withParams, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import * as Api from './mockApi'

type Env = {
	DB: D1Database
}

type CF = [env: Env, ctx: ExecutionContext]

const router = Router()

router
	.all('*', withParams)
	.post<IRequest, CF>('/reset', async (req, { DB }) => {
		await DB.prepare(`DELETE FROM attendees`).run()
		await DB.prepare(`VACUUM`).run()

		return json({ message: 'ok' })
	})
	.post<IRequest, CF>('/attendees', Api.CreateAttendee)
	.all('*', () => error(404))

export default {
	fetch: (request: Request, ...args: any[]) =>
		router.handle(request, ...args)
			.then(json)
			.catch(error)
};
