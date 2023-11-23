import { Query, Str } from '@cloudflare/itty-router-openapi'

export const OptionalAttendeeTokenQuery = Query(Str, {
  description: 'the attendee token',
  required: false,
})

export const OptionalDelivererTokenQuery = Query(Str, {
  description: 'the deliverer token',
  required: false,
})

export const OptionalPublicTokenQuery = Query(Str, {
  description: 'the attendee public token',
  required: false,
})
