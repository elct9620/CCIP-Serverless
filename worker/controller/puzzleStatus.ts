import { IRequest, StatusError } from 'itty-router'
import * as schema from '@api/schema'
import { PuzzleInfo } from '@api/usecase'
import { datetimeToUnix } from '@api/utils'
import { get } from '@worker/router'
import { json } from '@worker/utils'

export type PuzzleStatusRequest = {
  puzzleInfo: PuzzleInfo
} & IRequest

export class PuzzleStatus {
  @get('/event/puzzle')
  async getStatus({ puzzleInfo, query }: PuzzleStatusRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token is required')
    }

    const status = await puzzleInfo.getStatus(query.token as string)
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
