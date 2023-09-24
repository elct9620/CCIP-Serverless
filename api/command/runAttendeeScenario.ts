import { Scenario, Ruleset } from '@/event'
import { runRuleset } from '@/service'
import { GetRulesetInput } from '@api/projection'
import { Projection, Repository, Command, getCurrentTime } from '@/core'
import { Attendee } from '@/attendee'

export type RunAttendeeScenarioInput = {
  token: string
  scenarioId: string
}

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

type RunAttendeeScenarioOutput = Record<string, ScenarioInfo>

export class ScenarioUsedError extends Error {}
export class ScenarioNotFoundError extends Error {}
export class ScenarioNotAvailableError extends Error {}

export class RunAttendeeScenario
  implements Command<RunAttendeeScenarioInput, RunAttendeeScenarioOutput>
{
  private readonly attendees: Repository<Attendee>
  private readonly getRulesetByEvent: Projection<GetRulesetInput, Ruleset>

  constructor(
    attendees: Repository<Attendee>,
    getRulesetByEvent: Projection<GetRulesetInput, Ruleset>
  ) {
    this.attendees = attendees
    this.getRulesetByEvent = getRulesetByEvent
  }

  async execute({
    token,
    scenarioId,
  }: RunAttendeeScenarioInput): Promise<RunAttendeeScenarioOutput> {
    const attendee = await this.attendees.findById(token)
    if (!attendee) {
      return {}
    }

    if (attendee.isUsedScenario(scenarioId)) {
      throw new ScenarioUsedError('has been used')
    }

    const ruleset = await this.getRulesetByEvent.query({
      eventId: attendee.eventId,
      role: attendee.role,
    })
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
    await this.attendees.save(attendee)
    await runRuleset(attendee, ruleset)

    return buildAttendeeScenario(visibleScenarios)
  }
}

function buildAttendeeScenario(scenarios: Record<string, Scenario>): Record<string, ScenarioInfo> {
  const result: Record<string, ScenarioInfo> = {}

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
