import { Repository, Projection, Command } from '@/core'
import { Attendee } from '@/attendee'
import { Booth } from '@/event'
import { Status, Config, Stats } from '@/puzzle'
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
export class PuzzleConfigNotFoundError extends Error {}
export class PuzzleStatsNotFoundError extends Error {}

export class DeliverPuzzleCommand implements Command<DeliverPuzzleInput, DeliverPuzzleOutput> {
  private readonly attendees: Repository<Attendee>
  private readonly booths: Projection<FindBoothByTokenInput, Booth>
  private readonly statuses: Repository<Status>
  private readonly config: Repository<Config>
  private readonly stats: Repository<Stats>

  constructor(
    attendees: Repository<Attendee>,
    statuses: Repository<Status>,
    booths: Projection<FindBoothByTokenInput, Booth>,
    config: Repository<Config>,
    stats: Repository<Stats>
  ) {
    this.attendees = attendees
    this.statuses = statuses
    this.booths = booths
    this.config = config
    this.stats = stats
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
      throw new PuzzleConfigNotFoundError()
    }

    const stats = await this.stats.findById(input.eventId)
    if (!stats) {
      throw new PuzzleStatsNotFoundError()
    }

    const piece = pickUpPiece(config, stats)
    status.collectPiece(piece, booth.name)
    stats.deliverPuzzle(piece)

    await this.statuses.save(status)
    await this.stats.save(stats)

    return {
      success: true,
      attendeeName: status.displayName,
    }
  }
}

function pickUpPiece(config: Config, stats: Stats) {
  const pieceNames = Object.keys(config.pieces)
  const totalPieces = pieceNames.length

  let pickedPiece = pieceNames[0]
  for (const idx in config.pieces) {
    pickedPiece = pieceNames[Math.floor(Math.random() * pieceNames.length)]
    const isLast = totalPieces - 1 === Number(idx)
    const isFirstReedem = stats.totalDelivered === 0
    const isLowerDistribution =
      stats.distributionOf(pickedPiece) < config.distributionOf(pickedPiece)

    if (isLast || isFirstReedem || isLowerDistribution) {
      return pickedPiece
    }
  }

  return pickedPiece
}
