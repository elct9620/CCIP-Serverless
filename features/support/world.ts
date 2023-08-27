import { execSync } from 'child_process'
import { BeforeAll, AfterAll, World, setWorldConstructor } from '@cucumber/cucumber'
import { unstable_dev, UnstableDevWorker } from 'wrangler'

let apiWorker: UnstableDevWorker
let mockWorker: UnstableDevWorker

type WorkerResponse = {
	status: number
	json(): Promise<any>
	clone(): WorkerResponse
}

BeforeAll(async () => {
	execSync('NO_D1_WARNING=true wrangler d1 migrations apply DB --env test --local')

	apiWorker = await unstable_dev('api/worker.ts', {
		env: 'test',
		vars: {
			MOCK_DATE: '2023-08-27 00:00:00 GMT+8',
		},
		experimental: { disableExperimentalWarning: true },
	})
	mockWorker = await unstable_dev('mock/index.ts', {
		env: 'test',
		experimental: { disableExperimentalWarning: true },
	})
})

AfterAll(async () => {
	await apiWorker.stop()
	await mockWorker.stop()
})

export class WorkerWorld extends World {
	public apiResponse?: WorkerResponse

	constructor(options) {
		super(options)
	}

	get api(): UnstableDevWorker {
		return apiWorker
	}

	get mock(): UnstableDevWorker {
		return mockWorker
	}
}

setWorldConstructor(WorkerWorld)
