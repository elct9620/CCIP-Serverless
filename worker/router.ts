import { RouterType, RouteHandler, IRequest } from 'itty-router'
import { json, error } from '@worker/utils'

export interface Route {
  method?: string
  path: string
  handler: RouteHandler<IRequest & any>
}

export const setup = (router: RouterType, ...routes: Route[]) => {
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
