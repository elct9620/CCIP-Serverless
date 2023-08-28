import { LocalizedText } from './localized'
import { AttendeeMetadata } from './attendee'

export type Scenario = {
  order: number
  available_time: number | null
  expire_time: number | null
  display_text: LocalizedText
  used: number | null
  disabled: string | null
  attr: AttendeeMetadata
}
