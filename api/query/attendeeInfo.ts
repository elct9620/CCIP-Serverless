import { Query } from '@/core'
import { AttendeeRepository } from '../command/repository'

export type AttendeeScenario = {
  order: number
  displayText: Record<string, string>
  locked: boolean
  lockReason: string | null
}

export type AttendeeInfoInput = {
  token: string
}

export type AttendeeInfoOutput = {
  eventId: string
  displayName: string
  firstUsedAt: Date | null
  role: string
  scenario?: Record<string, AttendeeScenario>
  metadata: Record<string, any>
} | null

export class AttendeeInfo implements Query<AttendeeInfoInput, AttendeeInfoOutput> {
  private readonly attendeeRepository: AttendeeRepository

  constructor(attendeeRepository: AttendeeRepository) {
    this.attendeeRepository = attendeeRepository
  }

  public async execute(input: AttendeeInfoInput): Promise<AttendeeInfoOutput> {
    const attendee = await this.attendeeRepository.findByToken(input.token)
    if (!attendee) {
      return null
    }

    return {
      eventId: attendee.eventId,
      displayName: attendee.displayName,
      firstUsedAt: attendee.firstUsedAt,
      role: attendee.role,
      metadata: attendee.metadata,
    }
  }
}
