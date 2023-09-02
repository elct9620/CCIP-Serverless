import { Scenario } from './scenario'

export type RulesetAttribute = {
  eventId: string
  name: string
}

export class Ruleset {
  public readonly eventId: string
  public readonly name: string
  public readonly scenarios: Record<string, Scenario>

  constructor(attributes: RulesetAttribute) {
    this.eventId = attributes.eventId
    this.name = attributes.name
    this.scenarios = {}
  }

  addScenario(id: string, scenario: Scenario) {
    this.scenarios[id] = scenario
  }

  get visibleScenarios(): Record<string, Scenario> {
    const result: Record<string, Scenario> = {}

    for (const scenarioId in this.scenarios) {
      const scenario = this.scenarios[scenarioId]
      if (scenario.isVisible) {
        result[scenarioId] = scenario
      }
    }

    return result
  }
}
