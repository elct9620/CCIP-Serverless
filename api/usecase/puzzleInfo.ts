import { PuzzleStatusRepository } from './repository'

export type DeliverStatus = {
  deliverer: string
  redeemedAt: Date
}

export type PuzzleStatus = {
  displayName: string
  pieces: string[]
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

    const pieces = status.pieces.map(piece => piece.name)
    const delivers = status.pieces
      .filter(piece => piece.isReceived)
      .map(piece => ({
        deliverer: piece.giverName ?? '',
        redeemedAt: piece.receivedAt ?? new Date(0),
      }))

    return {
      displayName: status.displayName,
      isRevoked: status.isRevoked,
      completedAt: status.completedAt,
      redeemAt: status.redeemedAt,
      pieces,
      delivers,
    }
  }
}
