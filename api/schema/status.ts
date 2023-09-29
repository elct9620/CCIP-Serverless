import { Scenario } from './scenario'
import { AttendeeMetadata } from './attendee'

export type Status = {
  event_id: string
  public_token: string
  user_id: string
  first_use: number | null
  role: string
  scenario: Record<string, Scenario>
  attr: AttendeeMetadata
}
