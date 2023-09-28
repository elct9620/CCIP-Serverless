import { IRequest } from 'itty-router'
import { Env } from '@worker/environment'
import * as Repository from '@api/repository'
import * as Projection from '@api/projection'
import * as Command from '@api/command'

export const withCommands = (request: IRequest, env: Env) => {
  if (!env.DB) {
    throw new Error('DB is not available')
  }

  const announcementRepository = new Repository.D1AnnouncementRepository(env.DB)
  const attendeeRepository = new Repository.D1AttendeeRepository(env.DB)
  const getRulesetByEvent = new Projection.D1RulesetProjection(env.DB)

  const createAnnouncementCommand = new Command.CreateAnnouncement(announcementRepository)
  const runAttendeeScenario = new Command.RunAttendeeScenario(attendeeRepository, getRulesetByEvent)
  const initializeAttendeeCommand = new Command.InitializeAttendeeCommand(attendeeRepository)

  Object.assign(request, {
    createAnnouncementCommand,
    runAttendeeScenario,
    initializeAttendeeCommand,
  })
}
