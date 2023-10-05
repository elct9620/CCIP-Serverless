import { IRequest } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { get } from '@worker/router'
import { GetPuzzleStats } from '@api/query'

export type PuzzleStatsRequest = {
  getPuzzleStats: GetPuzzleStats
} & IRequest

export class PuzzleDashboard {
  @get('/event/puzzle/dashboard')
  async getStats({ getPuzzleStats, query }: PuzzleStatsRequest) {
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
