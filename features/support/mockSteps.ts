import { After, DataTable, Given } from '@cucumber/cucumber'
import { WorkerWorld } from './world'

Given('there have some attendees', async function (this: WorkerWorld, dataTable: DataTable) {
  const attendees = dataTable.hashes().map(row =>
    this.mock.fetch('https://testability.opass.app/attendees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    })
  )

  await Promise.all(attendees)
})

Given(
  'there have a ruleset for {string} with name {string} and scenarios:',
  async function (this: WorkerWorld, eventId: string, name: string, scenarios: string) {
    await this.mock.fetch('https://testability.opass.app/rulesets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id: eventId,
        name,
        scenarios: JSON.parse(scenarios),
      }),
    })
  }
)

Given('there are some announcements', async function (this: WorkerWorld, dataTable: DataTable) {
  await this.mock.fetch('https://testability.opass.app/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataTable.hashes()),
  })
})

Given(
  'there have some puzzle activity events',
  async function (this: WorkerWorld, dataTable: DataTable) {
    await this.mock.fetch('https://testability.opass.app/puzzle/activity_events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataTable.hashes()),
    })
  }
)

After(async function (this: WorkerWorld) {
  await this.mock.fetch('https://testability.opass.app/reset', {
    method: 'POST',
  })
})
