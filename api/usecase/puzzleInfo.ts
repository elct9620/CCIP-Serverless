export type DeliverStatus = {
  deliverer: string
  delivedAt: Date
}

export type PuzzleStatus = {
  displayName: string
  collectedItems: string[]
  delivers: DeliverStatus[]
  completedAt: Date | null
  couponUsedAt: Date | null
}

export class PuzzleInfo {
  async getStatus(): Promise<PuzzleStatus> {
    return {
      displayName: 'Aotoki',
      collectedItems: [],
      delivers: [],
      completedAt: null,
      couponUsedAt: null,
    }
  }
}
