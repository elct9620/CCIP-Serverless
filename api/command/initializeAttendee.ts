import { Command } from '@/core'
import { AttendeeRepository } from './repository'

export type InitAttendeeInput = {
  token: string
}

export class InitializeAttendeeCommand implements Command<InitAttendeeInput, void> {
  private readonly attendees: AttendeeRepository

  constructor(attendees: AttendeeRepository) {
    this.attendees = attendees
  }

  async execute(input: InitAttendeeInput): Promise<void> {
    const attendee = await this.attendees.findByToken(input.token)
    if (!attendee) {
      return
    }

    attendee.touch()
    await this.attendees.save(attendee)
  }
}
