import { injectable, inject } from 'tsyringe'
import { Repository, Projection, Command } from '@/core'
import { Attendee } from '@/attendee'
import { Booth } from '@/event'
import { Status, Config, Stats } from '@/puzzle'
import { FindBoothByTokenInput } from '@api/projection'
import {
  PuzzleReceiverNotFoundError,
  PuzzleDelivererNotFoundError,
  PuzzleAlreadyDeliveredError,
  PuzzleAttendeeNotInEventError,
  PuzzleConfigNotFoundError,
  PuzzleStatsNotFoundError,
} from './errors'

export type DeliverPuzzleInput = {
  token: string
  eventId: string
  delivererToken: string
}

export type DeliverPuzzleOutput = {
  success: boolean
  attendeeName: string
}

@injectable()
export class DeliverPuzzleCommand implements Command<DeliverPuzzleInput, DeliverPuzzleOutput> {
  constructor(
    @inject('IAttendeeRepository')
    private readonly attendees: Repository<Attendee>,
    @inject('IPuzzleStatusRepository')
    private readonly statuses: Repository<Status>,
    @inject('IFindBoothByTokenProjection')
    private readonly booths: Projection<FindBoothByTokenInput, Booth>,
    @inject('IPuzzleConfigRepository')
    private readonly config: Repository<Config>,
    @inject('IPuzzleStatsRepository')
    private readonly stats: Repository<Stats>
  ) {}

  async execute(input: DeliverPuzzleInput): Promise<DeliverPuzzleOutput> {
    const booth = await this.booths.query({ token: input.delivererToken })
    if (!booth) {
      throw new PuzzleDelivererNotFoundError()
    }

    const attendee = await this.attendees.findById(input.token)
    if (!attendee) {
      throw new PuzzleReceiverNotFoundError()
    }

    if (attendee.eventId !== input.eventId) {
      throw new PuzzleAttendeeNotInEventError()
    }

    const status = await this.statuses.findById(input.token)
    if (!status) {
      throw new PuzzleReceiverNotFoundError()
    }

    if (status.isNew()) {
      status.changeDisplayName(attendee.displayName)
    }

    if (status.isDeliveredBy(booth.name)) {
      throw new PuzzleAlreadyDeliveredError()
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
