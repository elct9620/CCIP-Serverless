import { Router, withParams } from 'itty-router'
import { withCommands, withTestability, withQueries } from '@worker/middlewares'
import { setup } from '@worker/router'
import * as Controller from '@worker/controller'

const router = Router()

router.all('*', withParams).all('*', withCommands).all('*', withQueries).all('*', withTestability)

const _Controllers = [
  Controller.AnnouncementController,
  Controller.StatusController,
  Controller.LandingController,
  Controller.UseController,
  Controller.PuzzleStatus,
  Controller.PuzzleDeliverer,
]

_Controllers.forEach((Controller: new () => object) => new Controller())

export default setup(router)
