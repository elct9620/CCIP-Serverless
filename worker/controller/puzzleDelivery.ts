import { container } from 'tsyringe'
import { IRequest, StatusError } from 'itty-router'
import {
  DeliverPuzzleCommand,
  PuzzleReceiverNotFoundError,
  PuzzleDelivererNotFoundError,
  PuzzleAlreadyDeliveredError,
  PuzzleAttendeeNotInEventError,
} from '@api/command'
import * as schema from '@api/schema'
import { Post } from '@worker/router'
import { json } from '@worker/utils'
import { OpenAPIRoute, OpenAPIRouteSchema, Str } from '@cloudflare/itty-router-openapi'

export type PuzzleDeliveryRequest = {
  query: Record<string, string | undefined>
} & IRequest

type Data = {
  body: unknown
}

@Post('/event/puzzle/deliver')
export class DeliverPuzzleToUser extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Deliver puzzle to attendee',
    tags: ['Puzzle'],
    requestBody: {
      receiver: new Str({ description: 'the attendee public token', required: false }),
    },
    parameters: {
      event_id: schema.EventIdQuery,
      token: schema.OptionalDelivererTokenQuery,
    },
    responses: {
      '200': {
        description: 'Delivered a puzzle to the attendee',
        schema: schema.puzzleDeliveredResponseSchema,
      },
      '400': {
        description: 'Invalid token or receiver public token, or already take from this deliverer',
      },
    },
  }

  async handle(request: PuzzleDeliveryRequest, env: unknown, context: unknown, data: Data) {
    const delivererToken = request.query.token
    const eventId = request.query.event_id as string
    const { body } = data
    const receiverToken = isDeliverPuzzleForm(body) ? body.receiver : null

    if (!delivererToken || !receiverToken) {
      throw new StatusError(400, 'token and receiver required')
    }

    try {
      const command = container.resolve(DeliverPuzzleCommand)
      const result = await command.execute({
        token: receiverToken,
        eventId,
        delivererToken: String(delivererToken),
      })

      return json<schema.PuzzleDeliveredResponse>({
        status: 'OK',
        user_id: result.attendeeName,
      })
    } catch (e: unknown) {
      if (e instanceof PuzzleReceiverNotFoundError) {
        throw new StatusError(404, 'invalid receiver token')
      }

      if (e instanceof PuzzleDelivererNotFoundError) {
        throw new StatusError(400, 'invalid token')
      }

      if (e instanceof PuzzleAlreadyDeliveredError) {
        throw new StatusError(400, 'Already take from this deliverer')
      }

      if (e instanceof PuzzleAttendeeNotInEventError) {
        throw new StatusError(400, 'Attendee not in event')
      }

      throw e
    }
  }
}

const isDeliverPuzzleForm = (value: unknown): value is schema.DeliverPuzzlePayload =>
  typeof (value as Record<string, unknown>)?.receiver === 'string'
