import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { beforeAll } from 'vitest'

let worker: UnstableDevWorker;

beforeAll(async () => {
	worker = await unstable_dev('src/index.ts', { experimental: { disableExperimentalWarning: true }});

	return async () => worker.stop()
})

export const getWorker = () => worker
