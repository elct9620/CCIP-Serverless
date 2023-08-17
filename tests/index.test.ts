import { getWorker } from './utils/worker'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

describe('GET /', () => {
	it('should return 200 response', async () => {
		const req = new Request('https://ccip.opass.app', { method: 'GET' })
		const resp = await getWorker().fetch(req.url)
		expect(resp.status).toBe(200)

		const text = await resp.text()
		expect(text).toBe('CCIP Serverless')
	})
})
