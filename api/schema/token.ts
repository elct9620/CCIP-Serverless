import { Query, Str } from '@cloudflare/itty-router-openapi'

export const RequiredTokenQuery = Query(Str, { required: true })
export const OptionalTokenQuery = Query(Str, { required: false })
