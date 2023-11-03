import { Repository, Command } from '@/core'
import { Attendee } from '@/attendee'

export type DeliverPuzzleInput = {
  token: string
}

export type DeliverPuzzleOutput = {
  success: boolean
  attendeeName: string
}

export class DeliverPuzzleCommand implements Command<DeliverPuzzleInput, DeliverPuzzleOutput> {
  private readonly attendees: Repository<Attendee>

  constructor(attendees: Repository<Attendee>) {
    this.attendees = attendees
  }

  async execute(input: DeliverPuzzleInput): Promise<DeliverPuzzleOutput> {
    const attendee = await this.attendees.findById(input.token)
    if (!attendee) {
      return {
        success: false,
        attendeeName: '',
      }
    }

    return {
      success: true,
      attendeeName: attendee.displayName,
    }
  }
}
