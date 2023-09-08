import { PuzzleStatusRepository } from './repository'

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
  private readonly statuses: PuzzleStatusRepository

  constructor(statuses: PuzzleStatusRepository) {
    this.statuses = statuses
  }

  async getStatus(publicToken: string): Promise<PuzzleStatus | null> {
    const status = await this.statuses.getStatus(publicToken)
    if (status === null) {
      return null
    }

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
