import type { RequestInit } from '@cloudflare/workers-types'
import { unstable_dev } from 'wrangler';
import type { UnstableDevWorker } from 'wrangler';


export class HttpServer {
	private worker?: UnstableDevWorker;

	async beforeAll(): Promise<Function> {
		this.worker = await unstable_dev('src/index.ts', { experimental: { disableExperimentalWarning: true }});
		return async () => await this.worker?.stop();
	}

	fetch(path: string, init?: RequestInit): Promise<Response> {
		return this.worker?.fetch(path, init) ?? Promise.reject('Worker not started');
	}
}
