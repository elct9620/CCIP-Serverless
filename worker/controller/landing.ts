import { IRequest, StatusError } from 'itty-router'
import { container } from 'tsyringe'
import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { json } from '@worker/utils'
import { Get } from '@worker/router'
import * as schema from '@api/schema'
import { AttendeeInfo } from '@api/query'

export type LandingRequest = {
  query: Record<string, string | undefined>
} & IRequest

export type LandingResponse = z.infer<typeof landingResponseSchema>
const landingResponseSchema = schema.basicAttendeeInfoSchema

@Get('/landing')
export class Landing extends OpenAPIRoute {
  schema = {
    summary: 'Get attendee display name',
    tags: ['Attendee'],
    request: {
      query: z.object({
        token: schema.OptionalAttendeeTokenQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Returns attendee display name',
        content: {
          'application/json': {
            schema: landingResponseSchema,
          },
        },
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
