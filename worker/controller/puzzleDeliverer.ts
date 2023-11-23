import { IRequest, StatusError } from 'itty-router'
import * as schema from '@api/schema'
import { ListBooth, GetBoothByToken } from '@api/query'
import { Get } from '@worker/router'
import { json } from '@worker/utils'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'

type DelivererListRequest = IRequest & {
  listBooth: ListBooth
}

type GetDelvierRequest = IRequest & {
  getBoothByToken: GetBoothByToken
}

@Get('/event/puzzle/deliverers')
export class ListPuzzleDelivers extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Get list of puzzle deliverers',
    tags: ['Puzzle'],
    parameters: {
      event_id: schema.EventIdQuery,
    },
  }

  async handle({ query, listBooth }: DelivererListRequest) {
    const booths = await listBooth.execute({ eventId: query.event_id as string })

    return json<schema.BoothList>(booths.map(({ name }) => name))
  }
}

@Get('/event/puzzle/deliverer')
export class GetPuzzleDeliverer extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Check deliver name',
    tags: ['Puzzle'],
    parameters: {
      token: schema.OptionalTokenQuery,
    },
  }

  async handle({ query, getBoothByToken }: GetDelvierRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token required')
    }

    const ownedBooth = await getBoothByToken.execute({ token: query.token as string })

    if (!ownedBooth) {
      throw new StatusError(400, 'invalid deliverer token')
    }

    return json<schema.BoothStaff>({ slug: ownedBooth.name })
  }
}
