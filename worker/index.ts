import { json, Router, withParams } from 'itty-router'
import { withUsecases, withTestability } from '@worker/middlewares'
import { error } from '@worker/utils'
import { setup } from '@worker/router'
import { routes } from '@worker/route'

const router = Router()

router.all('*', withParams).all('*', withUsecases).all('*', withTestability)

export default setup(router, ...routes)
