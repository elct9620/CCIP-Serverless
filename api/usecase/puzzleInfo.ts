import { Status } from '@/puzzle'

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
  redeemAt: Date | null
}

export class PuzzleInfo {
  async getStatus(publicToken: string): Promise<PuzzleStatus> {
    const status = new Status(publicToken)
    status.changeDisplayName('Aotoki')

    const collectedItems = status.collectedItems.map(item => item.id)
    const delivers = status.collectedItems.map(item => ({
      deliverer: item.deliverer,
      redeemedAt: item.collectedAt,
    }))

    return {
      displayName: status.displayName,
      isRevoked: status.isRevoked,
      completedAt: status.completedAt,
      redeemAt: status.redeemedAt,
      collectedItems,
      delivers,
    }
  }
}
