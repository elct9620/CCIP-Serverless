import { D1Database } from '@cloudflare/workers-types'

export type Env = {
	DB: D1Database
	// E2E testability
	MOCK_DATE?: string
}
