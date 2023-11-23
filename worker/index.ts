import { withParams } from 'itty-router'
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi'
import { withCommands, withTestability, withQueries } from '@worker/middlewares'
import { setup } from '@worker/router'
import * as Controller from '@worker/controller'

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

router.all('*', withParams).all('*', withCommands).all('*', withQueries).all('*', withTestability)

const _Controllers = [
  Controller.UseController,
  Controller.PuzzleStatus,
  Controller.PuzzleDeliverer,
  Controller.PuzzleDashboard,
]

_Controllers.forEach((Controller: new () => object) => new Controller())

export default setup(router)
