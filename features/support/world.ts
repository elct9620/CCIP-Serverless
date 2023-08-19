import { execSync } from 'child_process'
import { BeforeAll, AfterAll, World, setWorldConstructor } from '@cucumber/cucumber'
import { unstable_dev, UnstableDevWorker } from 'wrangler'

let apiWorker: UnstableDevWorker
let mockWorker: UnstableDevWorker

type WorkerResponse = {
	status: number
	json(): Promise<any>
}

BeforeAll(async () => {
	execSync('NO_D1_WARNING=true wrangler d1 migrations apply DB --env test --local')

	apiWorker = await unstable_dev('src/index.ts', {
		env: 'test',
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

	constructor(options: any) {
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
