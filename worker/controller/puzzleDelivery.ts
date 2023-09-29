import { IRequest, StatusError } from 'itty-router'
import { AttendeeInfo } from '@api/query'
import * as schema from '@api/schema'
import { post } from '@worker/router'
import { json } from '@worker/utils'

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

    const stubbedPermittedDelivererTokens: Record<string, string> = {
      '1024914b-ee65-4728-b687-8341f5affa89': 'Some booth',
    }
    if (stubbedPermittedDelivererTokens[String(delivererToken)]) {
      return json<schema.PuzzleDeliveredResponse>({
        status: 'OK',
        user_id: receiver.displayName,
      })
    } else {
      throw new StatusError(400, 'invalid token')
    }
  }
}

const isDeliverPuzzleForm = (value: unknown): value is schema.DeliverPuzzlePayload =>
  typeof (value as Record<string, unknown>)?.receiver === 'string'
