import { OpenAPIRouterType, OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { json, error } from '@worker/utils'

type OpenAPIRouteConstructor = new (...args: any[]) => OpenAPIRoute // eslint-disable-line @typescript-eslint/no-explicit-any
export interface Route {
  method?: string
  path: string
  handler: OpenAPIRouteConstructor
}

const routes: Route[] = []

export function Get<T extends OpenAPIRouteConstructor>(path: string) {
  return function (handler: T) {
    routes.push({
      method: 'get',
      path,
      handler,
    })
  }
}

export function Post<T extends OpenAPIRouteConstructor>(path: string) {
  return function (handler: T) {
    routes.push({
      method: 'post',
      path,
      handler,
    })
  }
}

export const setup = (router: OpenAPIRouterType) => {
  routes.forEach(({ method, path, handler }) => {
    if (method) {
      router[method](path, handler)
    } else {
      router.all(path, handler)
    }
  })

  router.all('*', () => error(404))

  return {
    fetch: (
      request: Request,
      ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
    ) =>
      router
        .handle(request, ...args)
        .then(json)
        .catch(error),
  }
}
