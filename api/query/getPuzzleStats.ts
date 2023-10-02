import { Query } from '@/core'

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

export class GetPuzzleStats implements Query<GetPuzzleStatsInput, GetPuzzleStatsOutput> {
  async execute(): Promise<GetPuzzleStatsOutput> {
    return {
      items: [],
      totalDelivered: 0,
      totalValid: 0,
    }
  }
}
