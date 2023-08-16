import { HttpServer } from './utils/worker';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('GET /', () => {
	let server: HttpServer = new HttpServer();
	beforeAll(() => server.beforeAll());

	it('should return 200 response', async () => {
		const req = new Request('https://ccip.opass.app', { method: 'GET' });
		const resp = await server.fetch(req.url);
		expect(resp.status).toBe(200);

		const text = await resp.text();
		expect(text).toBe('CCIP Serverless');
	});
});
