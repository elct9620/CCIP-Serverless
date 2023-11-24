import { scenarioSchema } from './scenario'
import { attendeeMetadataSchema } from './attendee'
import { z } from 'zod'

export type Status = z.infer<typeof statusSchema>
export const statusSchema = z.object({
  event_id: z.string().default('COSCUP_2023'),
  public_token: z.string().default('8b1619a7-347c-477a-9045-e48a7828a235'),
  user_id: z.string().default('user1234'),
  first_use: z.number().nullable().describe('timestamp').default(1650000000),
  role: z.string().default('audience'),
  scenario: z.record(scenarioSchema).describe('Scenario ID => Scenario'),
  attr: attendeeMetadataSchema,
})
