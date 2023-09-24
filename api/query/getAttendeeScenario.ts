import { Repository, Projection, Query } from '@/core'
import { GetRulesetInput } from '@api/projection'
import { runRuleset } from '@/service'
import { Attendee } from '@/attendee'
import { Ruleset, Scenario } from '@/event'

export type GetScenarioInput = {
  token: string
}

type AvailableTimeInfo = {
  start: Date
  end: Date
}

export type ScenarioInfo = {
  order: number
  availableTime: AvailableTimeInfo
  displayText: Record<string, string>
  usedAt: Date | null
  locked: boolean
  lockReason: string
  metadata: Record<string, any>
}

type GetScenarioOutput = Record<string, ScenarioInfo>

export class GetAttendeeScenario implements Query<GetScenarioInput, GetScenarioOutput> {
  private readonly attendees: Repository<Attendee>
  private readonly getAttendeeRuleset: Projection<GetRulesetInput, Ruleset>

  constructor(
    attendees: Repository<Attendee>,
    getAttendeeRuleset: Projection<GetRulesetInput, Ruleset>
  ) {
    this.attendees = attendees
    this.getAttendeeRuleset = getAttendeeRuleset
  }

  async execute({ token }: GetScenarioInput): Promise<GetScenarioOutput> {
    const attendee = await this.attendees.findById(token)
    if (!attendee) {
      return {}
    }

    const ruleset = await this.getAttendeeRuleset.query({
      eventId: attendee.eventId,
      role: attendee.role,
    })
    if (!ruleset) {
      return {}
    }

    await runRuleset(attendee, ruleset)

    return buildAttendeeScenario(ruleset.visibleScenarios)
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
