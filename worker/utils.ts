import { json as _json, ErrorFormatter, ErrorBody } from 'itty-router'
import type { ResponseInit } from '@cloudflare/workers-types'
import type { ApplicationError } from '@api/schema'

const errorMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
}

export const json = <T>(data: T, options?: ResponseInit): Response => _json(data, options)
export const error: ErrorFormatter = (a = 500, b?: ErrorBody) => {
  if (a instanceof Error) {
    const { message } = a
    a = a.status || 500
    b = message
  }

  b = b || errorMessages[a] || 'Unknown Error'

  return json<ApplicationError>({ message: b.toString() }, { status: a })
}
