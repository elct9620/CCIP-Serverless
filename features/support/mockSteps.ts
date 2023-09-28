import { UnstableDevWorker } from 'wrangler'
import { After, DataTable, Given } from '@cucumber/cucumber'
import { WorkerWorld } from './world'

async function createMockData(apiClient: UnstableDevWorker, path: string, body: string) {
  const res = await apiClient.fetch(`https://testability.opass.app${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }
}

Given('there have some attendees', async function (this: WorkerWorld, dataTable: DataTable) {
  const attendees = dataTable
    .hashes()
    .map(row => createMockData(this.mock, '/attendees', JSON.stringify(row)))

  await Promise.all(attendees)
})

Given(
  'there have a ruleset for {string} with name {string} and scenarios:',
  async function (this: WorkerWorld, eventId: string, name: string, scenarios: string) {
    await createMockData(
      this.mock,
      '/rulesets',
      JSON.stringify({
        event_id: eventId,
        name,
        scenarios: JSON.parse(scenarios),
      })
    )
  }
)

Given('there are some announcements', async function (this: WorkerWorld, dataTable: DataTable) {
  const toRowWithRolesAsArray = (row: Record<string, string>) => ({
    ...row,
    roles: JSON.parse(row.roles),
  })
  await createMockData(
    this.mock,
    '/announcements',
    JSON.stringify(dataTable.hashes().map(toRowWithRolesAsArray))
  )
})

Given(
  'there have some puzzle activity events',
  async function (this: WorkerWorld, dataTable: DataTable) {
    await createMockData(this.mock, '/puzzle/activity_events', JSON.stringify(dataTable.hashes()))
  }
)

Given('there have some booths', async function (this: WorkerWorld, dataTable: DataTable) {
  await createMockData(this.mock, '/booths', JSON.stringify(dataTable.hashes()))
})

After(async function (this: WorkerWorld) {
  await this.mock.fetch('https://testability.opass.app/reset', {
    method: 'POST',
  })
})
