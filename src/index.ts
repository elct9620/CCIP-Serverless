import { json, Router, withParams, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import * as API from './api'
import * as UseCase from './usecase'
import * as Repository from './repository'

type Env = {
	DB: D1Database
}

type CF = [env: Env, context: ExecutionContext]

const withUsecases = (request: IRequest, env: Env, context: ExecutionContext) => {
	const attendeeRepository = new Repository.D1AttendeeRepository(env.DB)
	const rulesetRepository = new Repository.D1RulesetRepository(env.DB)
	const attendeeInfo = new UseCase.AttendeeInfo(attendeeRepository, rulesetRepository)

	request.attendeeInfo = attendeeInfo
}

const router = Router()

router
	.all('*', withParams)
	.all<IRequest, CF>('*', withUsecases)
	.get<IRequest, CF>('/', () =>
		json({
			version: '0.1.0',
		})
	)
	// CCIP API
	.get('/landing', API.landing)
	.get('/status', API.status)
	// Default
	.all('*', () => API.error(404))

export default {
	fetch: (request: Request, ...args: any[]) =>
		router
			.handle(request, ...args)
			.then(json)
			.catch(API.error),
}
