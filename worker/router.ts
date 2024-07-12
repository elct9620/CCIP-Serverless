import { OpenAPIRouterType, OpenAPIRoute } from 'chanfana'
import { IttyRouterType } from 'itty-router'

type OpenAPIRouteConstructor = new (...args: any[]) => OpenAPIRoute // eslint-disable-line @typescript-eslint/no-explicit-any
export interface Route {
  method: string
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

export function Put<T extends OpenAPIRouteConstructor>(path: string) {
  return function (handler: T) {
    routes.push({
      method: 'put',
      path,
      handler,
    })
  }
}

type Router = IttyRouterType & OpenAPIRouterType<IttyRouterType>
export const setup = (router: Router) => {
  routes.forEach(({ method, path, handler }) => {
    router[method](path, handler)
  })

  router.all('*', () => error(404))

  return router
}
