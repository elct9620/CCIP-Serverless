import { Router, withParams } from 'itty-router'
import { withUsecases, withTestability } from '@worker/middlewares'
import { setup } from '@worker/router'
import * as Controller from '@worker/controller'

const router = Router()

router.all('*', withParams).all('*', withUsecases).all('*', withTestability)

const _Controllers = [
  Controller.AnnouncementController,
  Controller.StatusController,
  Controller.LandingController,
  Controller.UseController,
  Controller.PuzzleStatus,
]

_Controllers.forEach((Controller: new () => object) => new Controller())

export default setup(router)
