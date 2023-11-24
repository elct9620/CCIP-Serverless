import { IRequest, StatusError } from 'itty-router'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { RunAttendeeScenario } from '@api/command'
import { AttendeeInfo } from '@api/query'
import { datetimeToUnix } from '@api/utils'
import { Get } from '@worker/router'
import { OpenAPIRoute, OpenAPIRouteSchema } from '@cloudflare/itty-router-openapi'

export type UseRequest = {
  attendeeInfo: AttendeeInfo
  runAttendeeScenario: RunAttendeeScenario
  scenarioId: string
} & IRequest

export type UseResponse = schema.Status

function formatScenario(scenario: Record<string, any>) {
  const result: Record<string, schema.Scenario> = {}
  for (const key in scenario) {
    const value = scenario[key]
    result[key] = {
      order: value.order,
      available_time: datetimeToUnix(value.availableTime.start),
      expire_time: datetimeToUnix(value.availableTime.end),
      display_text: value.displayText,
      used: datetimeToUnix(value.usedAt),
      disabled: value.locked ? value.lockReason : null,
      attr: value.metadata,
    }
  }
  return result
}

@Get('/use/:scenarioId')
export class ApplyScenario extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    summary: 'Use scenario',
    tags: ['Event'],
    parameters: {
      token: schema.OptionalAttendeeTokenQuery,
      scenarioId: schema.ScenarioIdPath,
    },
    responses: {
      '200': {
        description: 'Used the scenario',
        schema: schema.statusSchema,
      },
      '400': {
        description: 'Missing or invalid token',
      },
    },
  }

  async handle({ attendeeInfo, runAttendeeScenario, scenarioId, query }: UseRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token required')
    }

    const info = await attendeeInfo.execute({ token: query.token as string })
    if (!info) {
      throw new StatusError(400, 'invalid token')
    }

    let scenarios: Record<string, any>
    try {
      scenarios = await runAttendeeScenario.execute({
        token: query.token as string,
        scenarioId,
      })
    } catch (e) {
      throw new StatusError(400, (e as Error).message)
    }

    return json<UseResponse>({
      event_id: info.eventId,
      public_token: info.publicToken,
      user_id: info.displayName,
      first_use: datetimeToUnix(info.firstUsedAt),
      role: info.role,
      scenario: formatScenario(scenarios),
      attr: info.metadata ?? {},
    })
  }
}
