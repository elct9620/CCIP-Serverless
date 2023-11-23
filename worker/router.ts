import { RouteHandler, IRequest } from 'itty-router'
import { OpenAPIRouterType } from '@cloudflare/itty-router-openapi'
import { json, error } from '@worker/utils'

type AppRequest = IRequest & any
export interface Route {
  method?: string
  path: string
  handler: RouteHandler<AppRequest>
}

const routes: Route[] = []

export function get(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    routes.push({
      method: 'get',
      path,
      handler: descriptor.value!,
    })
  }
}

export function post(path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    routes.push({
      method: 'post',
      path,
      handler: descriptor.value!,
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
    fetch: (request: Request, ...args: any[]) =>
      router
        .handle(request, ...args)
        .then(json)
        .catch(error),
  }
}
