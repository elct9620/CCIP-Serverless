import { IRequest, StatusError } from 'itty-router'
import { Get } from '@worker/router'
import { json } from '@worker/utils'
import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { container } from 'tsyringe'
import { ListBooth, GetBoothByToken } from '@api/query'
import * as schema from '@api/schema'

type DelivererListRequest = IRequest & {
  query: Record<string, string | undefined>
}

type GetDelvierRequest = IRequest & {
  query: Record<string, string | undefined>
}

@Get('/event/puzzle/deliverers')
export class ListPuzzleDelivers extends OpenAPIRoute {
  schema = {
    summary: 'Get list of puzzle deliverers',
    tags: ['Puzzle'],
    request: {
      params: z.object({
        event_id: schema.EventIdQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Returns list of puzzle deliverers',
        content: {
          'application/json': {
            schema: schema.boothListSchema,
          },
        },
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
  schema = {
    summary: 'Check deliver name',
    tags: ['Puzzle'],
    request: {
      query: z.object({
        token: schema.OptionalDelivererTokenQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Returns the slug',
        content: {
          'application/json': {
            schema: schema.boothStaffSchema,
          },
        },
      },
      '400': {
        description: 'Missing or invalid token',
      },
    },
  }

  async handle(request: GetDelvierRequest) {
    if (!request.query.token) {
      throw new StatusError(400, 'token required')
    }

    const query = container.resolve(GetBoothByToken)
    const ownedBooth = await query.execute({ token: request.query.token as string })

    if (!ownedBooth) {
      throw new StatusError(400, 'invalid deliverer token')
    }

    return json<schema.BoothStaff>({ slug: ownedBooth.name })
  }
}
