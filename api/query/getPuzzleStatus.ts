import { injectable, inject } from 'tsyringe'
import { Repository, Query } from '@/core'
import { Status } from '@/puzzle'

export type GetStatusInput = {
  publicToken: string
}

export type DeliverStatus = {
  deliverer: string
  redeemedAt: Date
}

export type GetStatusOutput = {
  displayName: string
  pieces: string[]
  delivers: DeliverStatus[]
  isRevoked: boolean
  completedAt: Date | null
  redeemAt: Date | null
}

@injectable()
export class GetPuzzleStatus implements Query<GetStatusInput, GetStatusOutput> {
  constructor(@inject('IPuzzleStatusRepository') private readonly statuses: Repository<Status>) {}

  async execute({ publicToken }: GetStatusInput): Promise<GetStatusOutput | null> {
    const status = await this.statuses.findById(publicToken)
    if (status === null) {
      return null
    }

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
