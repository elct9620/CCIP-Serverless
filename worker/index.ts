import 'reflect-metadata'
import { withParams, IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { withCommands, withTestability, withQueries } from '@worker/middlewares'
import { setup } from '@worker/router'
import { container } from 'tsyringe'
import { Env } from '@worker/environment'
import '@worker/controller'

import * as Repository from '@api/repository'
import * as Projection from '@api/projection'

const router = OpenAPIRouter({
  schema: {
    info: {
      title: 'CCIP Serverless',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://ccip-serverless.pages.dev',
        description: 'Production server',
      },
    ],
  },
})

router
  .all('*', (_request: IRequest, env: Env) => {
    if (!env.DB) {
      throw new Error('DB is not available')
    }

    container.register('database', { useValue: env.DB })

    // NOTE: Move this to a separate file
    container.register('IAnnouncementRepository', {
      useClass: Repository.D1AnnouncementRepository,
    })

    container.register('IAttendeeRepository', {
      useClass: Repository.D1AttendeeRepository,
    })

    container.register('IPuzzleStatsRepository', {
      useClass: Repository.D1PuzzleStatsRepository,
    })

    container.register('IAnnouncementProjection', {
      useClass: Projection.D1ListAnnouncementsByAttendee,
    })

    container.register('IBoothProjection', {
      useClass: Projection.D1AllBoothProjection,
    })

    container.register('IFindBoothByTokenProjection', {
      useClass: Projection.D1FindBoothByToken,
    })
  })
  .all('*', withParams)
  .all('*', withCommands)
  .all('*', withQueries)
  .all('*', withTestability)

export default setup(router)
