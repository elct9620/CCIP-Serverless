import { Repository, Command } from '@/core'
import { Attendee } from '@/attendee'

export type InitAttendeeInput = {
  token: string
}

export class InitializeAttendeeCommand implements Command<InitAttendeeInput, void> {
  private readonly attendees: Repository<Attendee>

  constructor(attendees: Repository<Attendee>) {
    this.attendees = attendees
  }

  async execute(input: InitAttendeeInput): Promise<void> {
    const attendee = await this.attendees.findById(input.token)
    if (!attendee) {
      return
    }

    attendee.touch()
    await this.attendees.save(attendee)
  }
}
