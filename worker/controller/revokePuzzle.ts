import { IRequest, StatusError } from 'itty-router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import * as Command from '@api/command'
import { Put } from '@worker/router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'

export type RevokePuzzleRequest = {
  revokePuzzle: Command.RevokePuzzleCommand
} & IRequest

@Put('/event/puzzle/revoke')
export class RevokePuzzle extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: "Revoke attendee's puzzle",
    tags: ['Puzzle'],
    requestBody: {},
    parameters: {
      event_id: schema.EventIdQuery,
      token: schema.OptionalAttendeeTokenQuery,
    },
    responses: {
      '200': {
        description: 'Result of puzzle revocation',
        schema: schema.puzzleRevokeResponseSchema,
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
