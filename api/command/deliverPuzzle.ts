import { Repository, Projection, Command } from '@/core'
import { Attendee } from '@/attendee'
import { Booth } from '@/event'
import { Status, Config } from '@/puzzle'
import { FindBoothByTokenInput } from '@api/projection'

export type DeliverPuzzleInput = {
  token: string
  eventId: string
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
  private readonly config: Repository<Config>

  constructor(
    attendees: Repository<Attendee>,
    statuses: Repository<Status>,
    booths: Projection<FindBoothByTokenInput, Booth>,
    config: Repository<Config>
  ) {
    this.attendees = attendees
    this.statuses = statuses
    this.booths = booths
    this.config = config
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

    const config = await this.config.findById(input.eventId)
    if (!config) {
      throw new PuzzleDelivererNotFoundError()
    }

    const piece = pickUpPiece(status, config)
    status.collectPiece(piece, booth.name)
    await this.statuses.save(status)

    return {
      success: true,
      attendeeName: status.displayName,
    }
  }
}

function pickUpPiece(status: Status, config: Config) {
  return Object.keys(config.pieces)[0]
}
