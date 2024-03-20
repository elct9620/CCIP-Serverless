import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { Post } from '@worker/router'
import { IRequest, status } from 'itty-router'

export type AttendeeRequest = IRequest

@Post('/admin/attendees')
export class CreateAttendees extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Creates attendees',
    tags: ['Attendee'],
    responses: {
      '200': {
        description: 'Creates attendees',
      },
    },
  }

  async handle(_request: AttendeeRequest) {
    return status(200)
  }
}
