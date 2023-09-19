import { IRequest } from 'itty-router'
import { Env } from '@worker/environment'
import * as Repository from '@api/repository'
import * as Command from '@api/command'

export const withCommands = (request: IRequest, env: Env) => {
  if (!env.DB) {
    throw new Error('DB is not available')
  }

  const announcementRepository = new Repository.D1AnnouncementRepository(env.DB)
  const attendeeRepository = new Repository.D1AttendeeRepository(env.DB)
  const rulesetRepository = new Repository.D1RulesetRepository(env.DB)
  const puzzleStatusRepository = new Repository.D1PuzzleStatusRepository(env.DB)

  const announcementInfo = new Command.AnnouncementInfo(announcementRepository, attendeeRepository)
  const attendeeInfo = new Command.AttendeeInfo(attendeeRepository, rulesetRepository)
  const attendeeAccess = new Command.AttendeeAccess(attendeeRepository, rulesetRepository)
  const puzzleInfo = new Command.PuzzleInfo(puzzleStatusRepository)

  Object.assign(request, {
    announcementInfo,
    attendeeInfo,
    attendeeAccess,
    puzzleInfo,
  })
}
