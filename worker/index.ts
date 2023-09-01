import { json, Router, withParams } from 'itty-router'
import { withUsecases, withTestability } from '@worker/middlewares'
import { error } from '@worker/utils'
import { setup } from '@worker/router'
import * as Controller from '@worker/controller'

const router = Router()

router.all('*', withParams).all('*', withUsecases).all('*', withTestability)

const controllers = [
  Controller.AnnouncementController,
  Controller.StatusController,
  Controller.LandingController,
  Controller.UseController,
].map((Controller: any) => new Controller())

export default setup(router)
