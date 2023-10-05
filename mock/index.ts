import { error, json, Router, withParams, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import * as Api from './api'

type Env = {
  DB: D1Database
}

type CF = [env: Env, ctx: ExecutionContext]

const router = Router()

router
  .all('*', withParams)
  .post<IRequest, CF>('/reset', Api.resetHandler)
  .post<IRequest, CF>('/announcements', Api.createAnnouncementHandler)
  .post<IRequest, CF>('/attendees', Api.createAttendeeHandler)
  .post<IRequest, CF>('/rulesets', Api.createRulesetHandler)
  .post<IRequest, CF>('/booths', Api.createBoothHandler)
  .post<IRequest, CF>('/puzzle/activity_events', Api.createPuzzleActivityEventHandler)
  .post<IRequest, CF>('/puzzle/stat_events', Api.createPuzzleStatEventHandler)
  .all('*', () => error(404))

export default {
  fetch: (request: Request, ...args: any[]) =>
    router
      .handle(request, ...args)
      .then(json)
      .catch(error),
}
