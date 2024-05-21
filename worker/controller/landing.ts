import { IRequest, StatusError } from 'itty-router'
import { json } from '@worker/utils'
import { container } from 'tsyringe'
import * as schema from '@api/schema'
import { AttendeeInfo } from '@api/query'
import { Get } from '@worker/router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { z } from 'zod'

export type LandingRequest = {
  query: Record<string, string | undefined>
} & IRequest

export type LandingResponse = z.infer<typeof landingResponseSchema>
const landingResponseSchema = schema.basicAttendeeInfoSchema

@Get('/landing')
export class Landing extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Get attendee display name',
    tags: ['Attendee'],
    parameters: {
      token: schema.OptionalAttendeeTokenQuery,
    },
    responses: {
      '200': {
        description: 'Returns attendee display name',
        schema: landingResponseSchema,
      },
      '400': {
        description: 'Missing or invalid token',
      },
    },
  }

  async handle(request: LandingRequest) {
    if (!request.query.token) {
      throw new StatusError(400, 'token required')
    }

    const query = container.resolve(AttendeeInfo)
    const info = await query.execute({ token: request.query.token as string })
    if (!info) {
      throw new StatusError(400, 'invalid token')
    }

    return json<LandingResponse>({ nickname: info.displayName })
  }
}
