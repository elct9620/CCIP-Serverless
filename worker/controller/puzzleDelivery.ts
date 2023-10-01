import { IRequest, StatusError } from 'itty-router'
import * as Query from '@api/query'
import * as schema from '@api/schema'
import { post } from '@worker/router'
import { json } from '@worker/utils'

export type PuzzleDeliveryRequest = {
  attendeeInfo: Query.AttendeeInfo
  getBoothByToken: Query.GetBoothByToken
} & IRequest

export class PuzzleDelivery {
  @post('/event/puzzle/deliver')
  async deliver(request: PuzzleDeliveryRequest) {
    const boothToken = request.query.token
    const body = await request.json()
    const receiverToken = isDeliverPuzzleForm(body) ? body.receiver : null

    if (!boothToken || !receiverToken) {
      throw new StatusError(400, 'token and receiver required')
    }

    const receiver = await request.attendeeInfo.execute({ token: receiverToken })
    if (!receiver) {
      throw new StatusError(404, 'invalid receiver token')
    }

    const booth = await request.getBoothByToken.execute({ token: String(boothToken) })
    if (!booth) {
      throw new StatusError(400, 'invalid token')
    }

    return json<schema.PuzzleDeliveredResponse>({
      status: 'OK',
      user_id: receiver.displayName,
    })
  }
}

const isDeliverPuzzleForm = (value: unknown): value is schema.DeliverPuzzlePayload =>
  typeof (value as Record<string, unknown>)?.receiver === 'string'
