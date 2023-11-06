import { Repository, Projection, Command } from '@/core'
import { Attendee } from '@/attendee'
import { Booth } from '@/event'
import { FindBoothByTokenInput } from '@api/projection'

export type DeliverPuzzleInput = {
  token: string
  delivererToken: string
}

export type DeliverPuzzleOutput = {
  success: boolean
  attendeeName: string
}

export class PuzzleReceiverNotFoundError extends Error {}
export class PuzzleDelivererNotFoundError extends Error {}

export class DeliverPuzzleCommand implements Command<DeliverPuzzleInput, DeliverPuzzleOutput> {
  private readonly attendees: Repository<Attendee>
  private readonly booths: Projection<FindBoothByTokenInput, Booth>

  constructor(attendees: Repository<Attendee>, booths: Projection<FindBoothByTokenInput, Booth>) {
    this.attendees = attendees
    this.booths = booths
  }

  async execute(input: DeliverPuzzleInput): Promise<DeliverPuzzleOutput> {
    const booth = await this.booths.query({ token: input.delivererToken })
    if (!booth) {
      throw new PuzzleDelivererNotFoundError()
    }

    const attendee = await this.attendees.findById(input.token)
    if (!attendee) {
      throw new PuzzleReceiverNotFoundError()
    }

    return {
      success: true,
      attendeeName: attendee.displayName,
    }
  }
}
