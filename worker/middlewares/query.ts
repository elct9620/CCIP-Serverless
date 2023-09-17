import { IRequest } from 'itty-router'
import { Env } from '@worker/environment'
import * as Projection from '@api/projection'
import * as Query from '@api/query'

export const withQueries = (request: IRequest, env: Env) => {
  if (!env.DB) {
    throw new Error('DB is not available')
  }

  const allBoothProjection = new Projection.D1AllBoothProjection(env.DB)
  const listBooth = new Query.ListBooth(allBoothProjection)

  Object.assign(request, {
    listBooth,
  })
}
