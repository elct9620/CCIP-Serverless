import { IRequest } from 'itty-router'
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
  async getStatus({ puzzleInfo }: PuzzleStatusRequest) {
    const status = await puzzleInfo.getStatus()

    const coupon = status.isRevoked ? 0 : datetimeToUnix(status.usedAt)

    return json<schema.PuzzleStatus>({
      user_id: status.displayName,
      puzzles: [],
      deliverers: [],
      valid: datetimeToUnix(status.completedAt),
      coupon,
    })
  }
}
