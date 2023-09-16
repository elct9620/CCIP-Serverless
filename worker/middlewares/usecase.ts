import { IRequest } from 'itty-router'
import { Env } from '@worker/environment'
import * as Repository from '@api/repository'
import * as UseCase from '@api/usecase'

export const withUsecases = (request: IRequest, env: Env) => {
  if (!env.DB) {
    throw new Error('DB is not available')
  }

  const announcementRepository = new Repository.D1AnnouncementRepository(env.DB)
  const attendeeRepository = new Repository.D1AttendeeRepository(env.DB)
  const rulesetRepository = new Repository.D1RulesetRepository(env.DB)
  const puzzleStatusRepository = new Repository.D1PuzzleStatusRepository(env.DB)
  const boothRepository = new Repository.D1BoothRepository(env.DB)

  const announcementInfo = new UseCase.AnnouncementInfo(announcementRepository, attendeeRepository)
  const attendeeInfo = new UseCase.AttendeeInfo(attendeeRepository, rulesetRepository)
  const attendeeAccess = new UseCase.AttendeeAccess(attendeeRepository, rulesetRepository)
  const puzzleInfo = new UseCase.PuzzleInfo(puzzleStatusRepository)
  const booth = new UseCase.Booth(boothRepository)

  Object.assign(request, {
    announcementInfo,
    attendeeInfo,
    attendeeAccess,
    puzzleInfo,
    booth,
  })
}
