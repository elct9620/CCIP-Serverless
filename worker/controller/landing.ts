import { IRequest, StatusError } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { AttendeeInfo } from '@api/query'
import { get } from '@worker/router'

export type LandingRequest = {
  attendeeInfo: AttendeeInfo
} & IRequest

export type LandingResponse = schema.BasicAttendeeInfo

export class LandingController {
  @get('/landing')
  async landing({ attendeeInfo, query }: LandingRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token required')
    }

    const info = await attendeeInfo.execute({ token: query.token as string })
    if (!info) {
      throw new StatusError(400, 'invalid token')
    }

    return json<LandingResponse>({ nickname: info.displayName })
  }
}
