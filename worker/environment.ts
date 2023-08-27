import { Env as ApiEnv } from '../api/environment'

export type Env = ApiEnv & {
	// E2E testability
	MOCK_DATE?: string
}
