import { IRequest } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { Get } from '@worker/router'
import { GetPuzzleStats } from '@api/query'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'

export type PuzzleStatsRequest = {
  getPuzzleStats: GetPuzzleStats
} & IRequest

@Get('/event/puzzle/dashboard')
export class DisplayPuzzleStats extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Get puzzle stats',
    tags: ['Puzzle'],
    parameters: {
      event_id: schema.EventIdQuery,
    },
  }

  async handle({ getPuzzleStats, query }: PuzzleStatsRequest) {
    const stats = await getPuzzleStats.execute({ eventId: query.event_id as string })

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
