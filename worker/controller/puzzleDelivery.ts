import { IRequest, StatusError } from 'itty-router'
import * as Command from '@api/command'
import * as schema from '@api/schema'
import { Post } from '@worker/router'
import { json } from '@worker/utils'
import { OpenAPIRoute, OpenAPIRouteSchema, Str } from '@cloudflare/itty-router-openapi'

export type PuzzleDeliveryRequest = {
  deliverPuzzle: Command.DeliverPuzzleCommand
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
    const delivererTooken = request.query.token
    const { body } = data
    const receiverToken = isDeliverPuzzleForm(body) ? body.receiver : null

    if (!delivererTooken || !receiverToken) {
      throw new StatusError(400, 'token and receiver required')
    }

    try {
      const result = await request.deliverPuzzle.execute({
        token: receiverToken,
        delivererToken: String(delivererTooken),
      })

      return json<schema.PuzzleDeliveredResponse>({
        status: 'OK',
        user_id: result.attendeeName,
      })
    } catch (e: unknown) {
      if (e instanceof Command.PuzzleReceiverNotFoundError) {
        throw new StatusError(404, 'invalid receiver token')
      }

      if (e instanceof Command.PuzzleDelivererNotFoundError) {
        throw new StatusError(400, 'invalid token')
      }

      if (e instanceof Command.PuzzledAlreadyDeliveredError) {
        throw new StatusError(400, 'Already take from this deliverer')
      }

      throw e
    }
  }
}

const isDeliverPuzzleForm = (value: unknown): value is schema.DeliverPuzzlePayload =>
  typeof (value as Record<string, unknown>)?.receiver === 'string'
