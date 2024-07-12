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
import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'

export type PuzzleDeliveryRequest = {
  query: Record<string, string | undefined>
} & IRequest

@Post('/event/puzzle/deliver')
export class DeliverPuzzleToUser extends OpenAPIRoute {
  schema = {
    summary: 'Deliver puzzle to attendee',
    tags: ['Puzzle'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              receiver: z.string({ description: 'the attendee public token' }).optional(),
            }),
          },
        },
      },
      query: z.object({
        event_id: schema.EventIdQuery,
        token: schema.OptionalDelivererTokenQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Delivered a puzzle to the attendee',
        content: {
          'application/json': {
            schema: schema.puzzleDeliveredResponseSchema,
          },
        },
      },
      '400': {
        description: 'Invalid token or receiver public token, or already take from this deliverer',
      },
    },
  }

  async handle() {
    const { body, query } = await this.getValidatedData<typeof this.schema>()
    const delivererToken = query.token
    const eventId = query.event_id
    const receiverToken = body.receiver

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
