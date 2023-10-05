import { Query, Repository } from '@/core'
import { Stats } from '@/puzzle'

export type GetPuzzleStatsInput = {
  eventId: string
}

type Stat = {
  name: string
  deliverAmount: number
  validAmount: number
}

export type GetPuzzleStatsOutput = {
  items: Stat[]
  totalDelivered: number
  totalValid: number
}

const emptyStats: GetPuzzleStatsOutput = {
  items: [],
  totalDelivered: 0,
  totalValid: 0,
}

export class GetPuzzleStats implements Query<GetPuzzleStatsInput, GetPuzzleStatsOutput> {
  private readonly stats: Repository<Stats>

  constructor(stats: Repository<Stats>) {
    this.stats = stats
  }

  async execute({ eventId }: GetPuzzleStatsInput): Promise<GetPuzzleStatsOutput> {
    const stats = await this.stats.findById(eventId)

    if (!stats) {
      return emptyStats
    }

    return {
      items: stats.puzzles.map(puzzle => ({
        name: puzzle.name,
        deliverAmount: puzzle.delivered,
        validAmount: puzzle.valid,
      })),
      totalDelivered: stats.totalDelivered,
      totalValid: stats.totalValid,
    }
  }
}
