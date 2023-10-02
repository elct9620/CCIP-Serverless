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
  async getStats({ getPuzzleStats }: PuzzleStatsRequest) {
    const stats = await getPuzzleStats.execute()

    return json<schema.PuzzleStats>([
      { puzzle: 'total', quantity: stats.totalDelivered, currency: stats.totalValid },
    ])
  }
}
