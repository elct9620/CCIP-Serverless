import { IRequest, StatusError } from 'itty-router'
import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import * as Command from '@api/command'
import { Put } from '@worker/router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'

export type RevokePuzzleRequest = {
  revokePuzzle: Command.RevokePuzzleCommand
} & IRequest

@Put('/event/puzzle/revoke')
export class RevokePuzzle extends OpenAPIRoute {
  schema = {
    summary: "Revoke attendee's puzzle",
    tags: ['Puzzle'],
    request: {
      params: z.object({
        event_id: schema.EventIdQuery,
      }),
      query: z.object({
        token: schema.OptionalAttendeeTokenQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Result of puzzle revocation',
        content: {
          'application/json': {
            schema: schema.puzzleRevokeResponseSchema,
          },
        },
      },
    },
  }

  async handle(request: RevokePuzzleRequest, _env: unknown, _context: unknown) {
    const token = request.query.token as string
    const eventId = request.query.event_id as string

    const output = await request.revokePuzzle.execute({
      token,
      eventId,
    })

    if (!output.success) {
      throw new StatusError(400, 'Unable to revoke puzzle')
    }

    return json({ status: 'OK' })
  }
}
