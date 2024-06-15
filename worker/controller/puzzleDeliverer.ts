import { IRequest, StatusError } from 'itty-router'
import * as schema from '@api/schema'
import { ListBooth, GetBoothByToken } from '@api/query'
import { Get } from '@worker/router'
import { json } from '@worker/utils'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { container } from 'tsyringe'

type DelivererListRequest = IRequest & {
  query: Record<string, string | undefined>
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
    responses: {
      '200': {
        description: 'Returns list of puzzle deliverers',
        schema: schema.boothListSchema,
      },
    },
  }

  async handle(request: DelivererListRequest) {
    const query = container.resolve(ListBooth)
    const booths = await query.execute({ eventId: request.query.event_id as string })

    return json<schema.BoothList>(booths.map(({ name }) => name))
  }
}

@Get('/event/puzzle/deliverer')
export class GetPuzzleDeliverer extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Check deliver name',
    tags: ['Puzzle'],
    parameters: {
      token: schema.OptionalDelivererTokenQuery,
    },
    responses: {
      '200': {
        description: 'Returns the slug',
        schema: schema.boothStaffSchema,
      },
      '400': {
        description: 'Missing or invalid token',
      },
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
