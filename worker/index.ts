import { json, Router, withParams, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import * as API from './route'
import * as UseCase from '../api/usecase'
import * as Repository from '../api/repository'
import { setFixedDatetime } from '../api/utils'
import { Env } from './environment'

type CF = [env: Env, context: ExecutionContext]

const withUsecases = (request: IRequest, env: Env, context: ExecutionContext) => {
  const attendeeRepository = new Repository.D1AttendeeRepository(env.DB)
  const rulesetRepository = new Repository.D1RulesetRepository(env.DB)
  const attendeeInfo = new UseCase.AttendeeInfo(attendeeRepository, rulesetRepository)
  const attendeeAccess = new UseCase.AttendeeAccess(attendeeRepository, rulesetRepository)

  Object.assign(request, {
    attendeeInfo,
    attendeeAccess,
  })
}

const withTestability = (request: IRequest, env: Env, context: ExecutionContext) => {
  if (env.MOCK_DATE) {
    setFixedDatetime(new Date(env.MOCK_DATE))
  }
}

const router = Router()

router
  .all('*', withParams)
  .all<IRequest, CF>('*', withUsecases)
  .all<IRequest, CF>('*', withTestability)
  .get<IRequest, CF>('/', () =>
    json({
      version: '0.1.0',
    })
  )
  // CCIP API
  .get('/announcement', API.announcement)
  .get('/landing', API.landing)
  .get('/status', API.status)
  .get('/use/:scenarioId', API.use)
  // Default
  .all('*', () => API.error(404))

export default {
  fetch: (request: Request, ...args: any[]) =>
    router
      .handle(request, ...args)
      .then(json)
      .catch(API.error),
}
