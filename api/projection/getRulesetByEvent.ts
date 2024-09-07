import { type D1Database } from '@cloudflare/workers-types'
import { Projection } from '@/core'
import { Ruleset, Scenario, ScenarioConditionType, Condition, ConditionType } from '@/event'

export type GetRulesetInput = {
  eventId: string
  role: string
}

type RulesetSchema = {
  event_id: string
  name: string
  scenarios: string
}

type ConditionSchema = {
  type: string
  args: any[]
  reason?: string
}

type MetadataSchema = {
  key: string
}

type AvailableTimeSchema = {
  start: string
  end: string
}

type ScenarioSchema = {
  order: number
  available_time: AvailableTimeSchema
  display_text: Record<string, string>
  conditions: Record<string, ConditionSchema>
  metadata: Record<string, MetadataSchema>
}

export class D1RulesetProjection implements Projection<GetRulesetInput, Ruleset> {
  private readonly db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  async query({ eventId, role }: GetRulesetInput): Promise<Ruleset | null> {
    const stmt = await this.db.prepare('SELECT * FROM rulesets WHERE event_id = ? AND name = ?')
    const result = await stmt.bind(eventId, role).first<RulesetSchema>()

    if (!result) {
      return null
    }

    let scenarios: Record<string, ScenarioSchema>
    try {
      scenarios = JSON.parse(result.scenarios)
    } catch (_e) {
      scenarios = {}
    }

    const ruleset = new Ruleset({
      eventId: result.event_id,
      name: result.name,
    })

    for (const scenarioId in scenarios) {
      const scenario = buildScenario(scenarios[scenarioId])
      ruleset.addScenario(scenarioId, scenario)
    }

    return ruleset
  }
}

function buildScenario(data: ScenarioSchema): Scenario {
  const scenario = new Scenario({
    availableTime: {
      start: new Date(data.available_time.start),
      end: new Date(data.available_time.end),
    },
    order: data.order,
    displayText: data.display_text,
    metadataDefinition: data.metadata,
  })

  for (const conditionType in data.conditions) {
    scenario.setCondition(
      conditionType as ScenarioConditionType,
      new Condition(
        data.conditions[conditionType].type as ConditionType,
        data.conditions[conditionType].args,
        data.conditions[conditionType].reason
      )
    )
  }

  return scenario
}
