import { IRequest, StatusError } from 'itty-router'
import { OpenAPIRoute } from 'chanfana'
import { z } from 'zod'
import { json } from '@worker/utils'
import * as schema from '@api/schema'
import { InitializeAttendeeCommand } from '@api/command'
import { AttendeeInfo, GetAttendeeScenario } from '@api/query'
import { datetimeToUnix } from '@api/utils'
import { Get } from '@worker/router'

export type StatusRequest = {
  attendeeInfo: AttendeeInfo
  getAttendeeScenario: GetAttendeeScenario
  initializeAttendeeCommand: InitializeAttendeeCommand
} & IRequest

export type StatusResponse = schema.Status

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

@Get('/status')
export class GetStatus extends OpenAPIRoute {
  schema = {
    summary: 'Get attendee status',
    tags: ['Attendee'],
    request: {
      query: z.object({
        StaffQuery: z.string({ description: 'is query by staff' }).optional(),
        token: schema.OptionalAttendeeTokenQuery,
      }),
    },
    responses: {
      '200': {
        description: 'Returns attendee status',
        content: {
          'application/json': {
            schema: schema.statusSchema,
          },
        },
      },
      '400': {
        description: 'Missing or invalid token',
      },
    },
  }

  async handle({
    attendeeInfo,
    initializeAttendeeCommand,
    getAttendeeScenario,
    query,
  }: StatusRequest) {
    if (!query.token) {
      throw new StatusError(400, 'token required')
    }

    const isStaffQuery = query.StaffQuery === 'true'
    if (!isStaffQuery) {
      await initializeAttendeeCommand.execute({ token: query.token as string })
    }

    const info = await attendeeInfo.execute({ token: query.token as string })
    if (!info) {
      throw new StatusError(400, 'invalid token')
    }

    const scenarios = await getAttendeeScenario.execute({ token: query.token as string })

    return json<StatusResponse>({
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
