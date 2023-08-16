import {
	json as _json,
	error as _error,
} from 'itty-router'
import type { ResponseInit } from '@cloudflare/workers-types'

export const json = <T>(data: T, options?: ResponseInit): Response => _json(data, options)
export const error = (status: number, message: string): Response => _error(status, { message })
