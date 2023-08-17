import { getWorker, getTestableWorker } from './utils/worker'
import { createAttendee, reset } from './mockApi'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import type { ApiError, LandingResponse } from '../src/api'

const REGISTERED_TOKEN = 'f185f505-d8c0-43ce-9e7b-bb9e8909072d'
const NOT_REGISTER_TOKEN = '79fd7131-f46e-4335-8d0c-ac1fa551288b'

describe('GET /landing', () => {
	beforeAll(async () => {
		await createAttendee(getTestableWorker(), { token: REGISTERED_TOKEN, user_id: 'Aotoki' })
	})

	afterAll(async () => {
		await reset(getTestableWorker())
	})

	it('can get nickname if token exists', async () => {
		const req = new Request(`https://ccip.opass.app/landing?token=${REGISTERED_TOKEN}`, {
			method: 'GET',
		})
		const resp = await getWorker().fetch(req.url)
		expect(resp.status).toBe(200)

		const json = await resp.json()
		expect(json).toMatchObject<LandingResponse>({ nickname: 'Aotoki' })
	})

	it('will get invalid token if no token provided', async () => {
		const req = new Request('https://ccip.opass.app/landing', { method: 'GET' })
		const resp = await getWorker().fetch(req.url)
		expect(resp.status).toBe(400)

		const json = await resp.json()
		expect(json).toMatchObject<ApiError>({ message: 'token required' })
	})

	it('will get invalid token if token not exists', async () => {
		const req = new Request(`https://ccip.opass.app/landing?token=${NOT_REGISTER_TOKEN}`, {
			method: 'GET',
		})
		const resp = await getWorker().fetch(req.url)
		expect(resp.status).toBe(400)

		const json = await resp.json()
		expect(json).toMatchObject<ApiError>({ message: 'invalid token' })
	})
})
