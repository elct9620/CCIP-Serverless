import { IRequest } from 'itty-router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { Put } from '@worker/router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'

export type RevokePuzzleRequest = IRequest

@Put('/event/puzzle/revoke')
export class RevokePuzzle extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: "Revoke attendee's puzzle",
    tags: ['Puzzle'],
    requestBody: {},
    parameters: {
      token: schema.OptionalAttendeeTokenQuery,
    },
    responses: {
      '200': {
        description: 'Result of puzzle revocation',
        schema: schema.puzzleRevokeResponseSchema,
      },
    },
  }

  async handle(_request: RevokePuzzleRequest, _env: unknown, _context: unknown) {
    return json({ status: 'OK' })
  }
}
