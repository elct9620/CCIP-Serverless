import { IRequest } from 'itty-router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'
import { Put } from '@worker/router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'

export type UseCouponRequest = IRequest

@Put('/event/puzzle/coupon')
export class UseCoupon extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: "Use attendee's puzzle to redeem coupon",
    tags: ['Puzzle'],
    requestBody: {},
    parameters: {
      event_id: schema.EventIdQuery,
      token: schema.OptionalAttendeeTokenQuery,
    },
    responses: {
      '200': {
        description: 'Result of coupon redemption',
        schema: schema.puzzleCouponRedeemResponseSchema,
      },
    },
  }

  async handle(_request: UseCouponRequest, _env: unknown, _context: unknown) {
    return json({ status: 'OK' })
  }
}
