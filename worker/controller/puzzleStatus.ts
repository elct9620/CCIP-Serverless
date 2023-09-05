import * as schema from '@api/schema'
import { get } from '@worker/router'
import { json } from '@worker/utils'

export class PuzzleStatus {
  @get('/event/puzzle')
  async getStatus() {
    return json<schema.PuzzleStatus>({
      user_id: 'Aotoki',
      puzzles: [],
      deliverers: [],
      valid: 0,
      coupon: 0,
    })
  }
}
