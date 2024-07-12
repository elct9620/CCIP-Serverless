import { localizedTextSchema } from './localized'
import { attendeeMetadataSchema } from './attendee'
import { z } from 'zod'

export const ScenarioIdPath = z.string({ description: 'scenario name to apply' })

export type Scenario = z.infer<typeof scenarioSchema>
export const scenarioSchema = z.object({
  order: z.number().describe('display order').default(1),
  available_time: z.number().nullable().describe('timestamp').default(1600000000),
  expire_time: z.number().nullable().describe('timestamp').default(1700000000),
  display_text: localizedTextSchema,
  used: z.number().nullable().describe('timestamp').default(1650000000),
  disabled: z.string().nullable(),
  attr: attendeeMetadataSchema,
})
