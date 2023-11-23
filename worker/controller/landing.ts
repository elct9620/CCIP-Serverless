import { IRequest, StatusError } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { AttendeeInfo } from '@api/query'
import { Get } from '@worker/router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'

export type LandingRequest = {
  attendeeInfo: AttendeeInfo
} & IRequest

export type LandingResponse = schema.BasicAttendeeInfo

@Get('/landing')
export class Landing extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Get attendee display name',
    tags: ['Attendee'],
    parameters: {
      token: schema.OptionalAttendeeTokenQuery,
    },
  }

  async handle({ attendeeInfo, query }: LandingRequest) {
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
