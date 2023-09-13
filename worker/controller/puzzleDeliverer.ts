import { get } from '@worker/router'
import { json } from '@worker/utils'

export class PuzzleDeliverer {
  @get('/event/puzzle/deliverers')
  async getDeliverers() {
    return json<string[]>(['COSCUP', 'SITCON'])
  }
}
