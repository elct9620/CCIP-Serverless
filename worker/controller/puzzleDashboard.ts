import { IRequest } from 'itty-router'
import { json } from '@worker/utils'
import { container } from 'tsyringe'
import * as schema from '@api/schema'
import { Get } from '@worker/router'
import { GetPuzzleStats } from '@api/query'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'

@Get('/event/puzzle/dashboard')
export class DisplayPuzzleStats extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Get puzzle stats',
    tags: ['Puzzle'],
    parameters: {
      event_id: schema.EventIdQuery,
    },
    responses: {
      '200': {
        description: 'Returns puzzle stats',
        schema: schema.puzzleStatsSchema,
      },
    },
  }

  async handle(request: IRequest) {
    const query = container.resolve(GetPuzzleStats)
    const stats = await query.execute({ eventId: request.query.event_id as string })

    return json<schema.PuzzleStats>([
      ...stats.items.map(({ name, deliverAmount, validAmount }) => ({
        puzzle: name,
        quantity: deliverAmount,
        currency: validAmount,
      })),
      { puzzle: 'total', quantity: stats.totalDelivered, currency: stats.totalValid },
    ])
  }
}
