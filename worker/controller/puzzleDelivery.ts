import { StatusError } from 'itty-router'
import { post } from '@worker/router'

export class PuzzleDelivery {
  @post('/event/puzzle/deliver')
  async deliver() {
    throw new StatusError(400, 'token and receiver required')
  }
}
