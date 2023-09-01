import { json, Router, withParams } from 'itty-router'
import { withUsecases, withTestability } from '@worker/middlewares'
import * as API from '@worker/route'

const router = Router()

router
  .all('*', withParams)
  .all('*', withUsecases)
  .all('*', withTestability)
  // CCIP API
  .get('/announcement', API.listAnnouncements)
  .post('/announcement', API.createAnnouncement)
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
