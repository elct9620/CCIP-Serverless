import { withParams } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { withCommands, withTestability, withQueries, withInversify } from '@worker/middlewares'
import { setup } from '@worker/router'
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
  .all('*', withParams)
  .all('*', withInversify)
  .all('*', withCommands)
  .all('*', withQueries)
  .all('*', withTestability)

export default setup(router)
