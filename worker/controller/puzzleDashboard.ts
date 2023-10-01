import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { get } from '@worker/router'

export class PuzzleDashboard {
  @get('/event/puzzle/dashboard')
  async getStats() {
    return json<schema.PuzzleStats>([{ puzzle: 'total', quantity: 0, currency: 0 }])
  }
}
