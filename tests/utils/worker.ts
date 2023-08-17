import { execSync } from 'child_process';
import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';
import { beforeAll } from 'vitest'

let worker: UnstableDevWorker;
let testableWorker: UnstableDevWorker;

beforeAll(async () => {
	execSync('NO_D1_WARNING=true wrangler d1 migrations apply DB --env test --local')
	worker = await unstable_dev('src/index.ts', { env: 'test', experimental: { disableExperimentalWarning: true }});
	testableWorker = await unstable_dev('tests/mock.ts', { env: 'test', experimental: { disableExperimentalWarning: true }});

	return async () => {
		worker.stop()
		testableWorker.stop()
	}
})

export const getWorker = () => worker
export const getTestableWorker = () => testableWorker
