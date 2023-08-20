import { When, Then } from '@cucumber/cucumber'
import { WorkerWorld } from './world'
import { expect } from 'expect'

When('I make a GET request to {string}', async function (this: WorkerWorld, path: string) {
	this.apiResponse = await this.api.fetch(`https://ccip.opass.app${path}`, { method: 'GET' })
})

Then('the response status should be {int}', async function (statusCode) {
	expect(this.apiResponse?.status).toEqual(statusCode)
})

Then('the response json should be:', async function (this: WorkerWorld, expectedJsonString) {
	const expectedJson = JSON.parse(expectedJsonString)
	const actualJson = await this.apiResponse?.json()
	expect(actualJson).toMatchObject(expectedJson)
})

Then(
	'the response json should have property {string} is null',
	async function (this: WorkerWorld, property) {
		const actualJson = await this.apiResponse?.json()
		expect(actualJson).toHaveProperty(property)
		expect(actualJson[property]).toBeNull()
	}
)

Then(
	'the response json should have property {string} is not null',
	async function (this: WorkerWorld, property) {
		const actualJson = await this.apiResponse?.json()
		expect(actualJson).toHaveProperty(property)
		expect(actualJson[property]).not.toBeNull()
	}
)
