export type DeliverStatus = {
  deliverer: string
  redeemedAt: Date
}

export type PuzzleStatus = {
  displayName: string
  collectedItems: string[]
  delivers: DeliverStatus[]
  isRevoked: boolean
  completedAt: Date | null
  usedAt: Date | null
}

export class PuzzleInfo {
  async getStatus(): Promise<PuzzleStatus> {
    return {
      displayName: 'Aotoki',
      collectedItems: [],
      delivers: [],
      isRevoked: false,
      completedAt: null,
      usedAt: null,
    }
  }
}
