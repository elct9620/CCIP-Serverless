import { Repository, Projection, Command } from '@/core'
import { Attendee } from '@/attendee'
import { Booth } from '@/event'
import { Status } from '@/puzzle'
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
export class PuzzledAlreadyDeliveredError extends Error {}

export class DeliverPuzzleCommand implements Command<DeliverPuzzleInput, DeliverPuzzleOutput> {
  private readonly attendees: Repository<Attendee>
  private readonly booths: Projection<FindBoothByTokenInput, Booth>
  private readonly statuses: Repository<Status>

  constructor(
    attendees: Repository<Attendee>,
    statuses: Repository<Status>,
    booths: Projection<FindBoothByTokenInput, Booth>
  ) {
    this.attendees = attendees
    this.statuses = statuses
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

    const status = await this.statuses.findById(input.token)
    if (!status) {
      throw new PuzzleReceiverNotFoundError()
    }

    if (status.isNew()) {
      status.changeDisplayName(attendee.displayName)
    }

    if (status.isDeliveredBy(booth.name)) {
      throw new PuzzledAlreadyDeliveredError()
    }

    await this.statuses.save(status)

    return {
      success: true,
      attendeeName: status.displayName,
    }
  }
}
