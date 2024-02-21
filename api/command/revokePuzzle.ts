import { Repository, Command } from '@/core'
import { Status, Stats } from '@/puzzle'
import { PuzzleReceiverNotFoundError, PuzzleStatsNotFoundError } from './errors'

export type RevokePuzzleInput = {
  token: string
  eventId: string
}

export type RevokePuzzleOutput = {
  success: boolean
}

export class RevokePuzzleCommand implements Command<RevokePuzzleInput, RevokePuzzleOutput> {
  private readonly statuses: Repository<Status>
  private readonly stats: Repository<Stats>

  constructor(statuses: Repository<Status>, stats: Repository<Stats>) {
    this.statuses = statuses
    this.stats = stats
  }

  async execute(input: RevokePuzzleInput): Promise<RevokePuzzleOutput> {
    const status = await this.statuses.findById(input.token)
    if (!status) {
      throw new PuzzleReceiverNotFoundError()
    }

    if (status.isNew()) {
      return { success: false }
    }

    const stats = await this.stats.findById(input.eventId)
    if (!stats) {
      throw new PuzzleStatsNotFoundError()
    }

    status.revoke()
    for (const piece of status.pieces) {
      stats.revokePuzzle(piece.name)
    }

    await this.statuses.save(status)
    await this.stats.save(stats)

    return {
      success: true,
    }
  }
}
