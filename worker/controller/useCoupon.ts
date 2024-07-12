import { IRequest, StatusError } from 'itty-router'
import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { Put } from '@worker/router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import * as Command from '@api/command'

export type UseCouponRequest = {
  useCoupon: Command.UseCouponCommand
} & IRequest

@Put('/event/puzzle/coupon')
export class UseCoupon extends OpenAPIRoute {
  schema = {
    summary: "Use attendee's puzzle to redeem coupon",
    tags: ['Puzzle'],
    request: {
      query: z.object({
        token: schema.OptionalAttendeeTokenQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Result of coupon redemption',
        content: {
          'application/json': {
            schema: schema.puzzleCouponRedeemResponseSchema,
          },
        },
      },
    },
  }

  async handle(request: UseCouponRequest, _env: unknown, _context: unknown) {
    const publicToken = request.query.token as string
    const success = await request.useCoupon.execute({ publicToken })

    if (!success) {
      throw new StatusError(400, 'Failed to redeem coupon')
    }

    return json({ status: 'OK' })
  }
}
