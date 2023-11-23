import { IRequest, StatusError } from 'itty-router'
import * as schema from '@api/schema'
import { GetPuzzleStatus } from '@api/query'
import { datetimeToUnix } from '@api/utils'
import { Get } from '@worker/router'
import { json } from '@worker/utils'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'

export type PuzzleStatusRequest = {
  getPuzzleStatus: GetPuzzleStatus
} & IRequest

@Get('/event/puzzle')
export class GetAttendeePuzzleStatus extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Get attendee puzzle status',
    tags: ['Puzzle'],
    parameters: {
      token: schema.OptionalPublicTokenQuery,
    },
  }

  async handle({ getPuzzleStatus, query }: PuzzleStatusRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token is required')
    }

    const status = await getPuzzleStatus.execute({ publicToken: query.token as string })
    if (status === null) {
      throw new StatusError(404, 'Invalid token, please try again after checkin.')
    }

    const coupon = status.isRevoked ? 0 : datetimeToUnix(status.redeemAt)

    return json<schema.PuzzleStatus>({
      user_id: status.displayName,
      puzzles: status.pieces,
      deliverers: status.delivers.map(deliver => deliver.deliverer),
      valid: datetimeToUnix(status.completedAt),
      coupon,
    })
  }
}
