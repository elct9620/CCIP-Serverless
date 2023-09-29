import { IRequest, StatusError } from 'itty-router'
import { post } from '@worker/router'
import { AttendeeInfo } from '@api/query'
import { DeliverPuzzlePayload } from '@api/schema'

export type PuzzleDeliveryRequest = {
  attendeeInfo: AttendeeInfo
} & IRequest

export class PuzzleDelivery {
  @post('/event/puzzle/deliver')
  async deliver(request: PuzzleDeliveryRequest) {
    const delivererToken = request.query.token
    const body = await request.json()
    const receiverToken = isDeliverPuzzleForm(body) ? body.receiver : null

    if (!delivererToken || !receiverToken) {
      throw new StatusError(400, 'token and receiver required')
    }

    const receiver = await request.attendeeInfo.execute({ token: receiverToken })
    if (!receiver) {
      throw new StatusError(404, 'invalid receiver token')
    }
  }
}

const isDeliverPuzzleForm = (value: unknown): value is DeliverPuzzlePayload =>
  typeof (value as Record<string, unknown>)?.receiver === 'string'
