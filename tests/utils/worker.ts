import { execSync } from 'child_process';
import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { beforeAll } from 'vitest'

let worker: UnstableDevWorker;

beforeAll(async () => {
	execSync('NO_D1_WARNING=true wrangler d1 migrations apply DB --local')
	worker = await unstable_dev('src/index.ts', { experimental: { disableExperimentalWarning: true }});

	return async () => worker.stop()
})

export const getWorker = () => worker
