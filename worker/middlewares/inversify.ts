import { Env } from '@worker/environment'
import { type D1Database } from '@cloudflare/workers-types'
import { database } from '@api/repository'
import container from '@/container'

export const withInversify = (_req: Request, env: Env) => {
  if (container.isBound(database)) {
    return
  }

  container.bind<D1Database>(database).toConstantValue(env.DB)
}
