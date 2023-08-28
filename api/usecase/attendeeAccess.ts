import { AttendeeRepository, RulesetRepository } from './repository'
import { Scenario } from '../../src/event'
import { runRuleset } from '../../src/service'
import { getCurrentTime } from '../utils'

type AvailableTimeInfo = {
  start: Date
  end: Date
}

type ScenarioInfo = {
  order: number
  availableTime: AvailableTimeInfo
  displayText: Record<string, string>
  usedAt: Date | null
  locked: boolean
  lockReason: string
  metadata: Record<string, any>
}

type AttendeeScenario = Record<string, ScenarioInfo>

export class ScenarioUsedError extends Error {}
export class ScenarioNotFoundError extends Error {}
export class ScenarioNotAvailableError extends Error {}

export class AttendeeAccess {
  private readonly attendeeRepository: AttendeeRepository
  private readonly rulesetRepository: RulesetRepository

  constructor(attendeeRepository: AttendeeRepository, rulesetRepository: RulesetRepository) {
    this.attendeeRepository = attendeeRepository
    this.rulesetRepository = rulesetRepository
  }

  async getScenarios(token: string): Promise<AttendeeScenario> {
    const attendee = await this.attendeeRepository.findByToken(token)
    if (!attendee) {
      return {}
    }

    const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
    if (!ruleset) {
      return {}
    }

    await runRuleset(attendee, ruleset)

    return buildAttendeeScenario(ruleset.visibleScenarios)
  }

  async useScenario(token: string, scenarioId: string): Promise<AttendeeScenario> {
    const attendee = await this.attendeeRepository.findByToken(token)
    if (!attendee) {
      return {}
    }

    if (attendee.isUsedScenario(scenarioId)) {
      throw new ScenarioUsedError('has been used')
    }

    const ruleset = await this.rulesetRepository.findByEventId(attendee.eventId, attendee.role)
    if (!ruleset) {
      return {}
    }

    await runRuleset(attendee, ruleset)

    const visibleScenarios = ruleset.visibleScenarios
    const scenario = visibleScenarios[scenarioId]
    if (!scenario) {
      throw new ScenarioNotFoundError('invalid scenario')
    }

    const currentTime = getCurrentTime()

    if (!scenario.isAvailableAt(currentTime)) {
      throw new ScenarioNotAvailableError('link is expired or not available yet')
    }

    attendee.useScenario(scenarioId, currentTime)
    await this.attendeeRepository.save(attendee)
    await runRuleset(attendee, ruleset)

    return buildAttendeeScenario(visibleScenarios)
  }
}

function buildAttendeeScenario(scenarios: Record<string, Scenario>): Record<string, ScenarioInfo> {
  let result: Record<string, ScenarioInfo> = {}

  for (const scenarioId in scenarios) {
    const scenario = scenarios[scenarioId]
    result[scenarioId] = {
      order: scenario.order,
      availableTime: scenario.availableTime,
      displayText: scenario.displayText,
      usedAt: scenario.usedAt,
      locked: scenario.isLocked,
      lockReason: scenario.lockReason,
      metadata: scenario.metadata,
    }
  }

  return result
}
