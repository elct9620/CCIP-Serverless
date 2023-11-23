import { Query, Str } from '@cloudflare/itty-router-openapi'

export const EventIdQuery = Query(Str, { description: 'event id' })
