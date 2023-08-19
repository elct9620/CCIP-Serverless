import { Given, After } from '@cucumber/cucumber'
import { WorkerWorld } from './world'

Given('there have some attendees', async function (this: WorkerWorld, dataTable) {
	const attendees = dataTable.hashes().map(row => {
		this.mock.fetch('https://testability.opass.app/attendees', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(row),
		})
	})

	await Promise.all(attendees)
})

After(async function (this: WorkerWorld) {
	await this.mock.fetch('https://testability.opass.app/reset', {
		method: 'POST',
	})
})
