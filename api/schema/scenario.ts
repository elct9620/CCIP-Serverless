import { LocalizedText } from './localized'
import { AttendeeMetadata } from './attendee'
import { Path, Str } from '@cloudflare/itty-router-openapi'

export const ScenarioIdPath = Path(Str, { description: 'scenarion name to apply' })

export type Scenario = {
  order: number
  available_time: number | null
  expire_time: number | null
  display_text: LocalizedText
  used: number | null
  disabled: string | null
  attr: AttendeeMetadata
}
