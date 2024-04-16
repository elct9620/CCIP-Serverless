import 'reflect-metadata'
import { withParams, IRequest } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { withCommands, withTestability, withQueries } from '@worker/middlewares'
import { setup } from '@worker/router'
import { container } from 'tsyringe'
import { Env } from '@worker/environment'
import '@worker/controller'

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
  })
  .all('*', withParams)
  .all('*', withCommands)
  .all('*', withQueries)
  .all('*', withTestability)

export default setup(router)
