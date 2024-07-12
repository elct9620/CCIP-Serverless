import { error, AutoRouter, IRequest } from 'itty-router'
import { D1Database, ExecutionContext } from '@cloudflare/workers-types'
import * as Api from './api'

type Env = {
  DB: D1Database
}

type CF = [env: Env, ctx: ExecutionContext]

const router = AutoRouter()

router
  .post<IRequest, CF>('/reset', Api.resetHandler)
  .post<IRequest, CF>('/announcements', Api.createAnnouncementHandler)
  .post<IRequest, CF>('/attendees', Api.createAttendeeHandler)
  .post<IRequest, CF>('/rulesets', Api.createRulesetHandler)
  .post<IRequest, CF>('/booths', Api.createBoothHandler)
  .post<IRequest, CF>('/puzzle/activity_events', Api.createPuzzleActivityEventHandler)
  .post<IRequest, CF>('/puzzle/stat_events', Api.createPuzzleStatEventHandler)
  .post<IRequest, CF>('/puzzle/configs', Api.createPuzzleConfigHandler)
  .all('*', () => error(404))

export default router
