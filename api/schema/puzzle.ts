export type PuzzleStatus = {
  user_id: string
  puzzles: string[]
  deliverers: string[]
  valid: number | null
  coupon: number | null
}

export type DeliverPuzzlePayload = {
  receiver: string
}

export type PuzzleDeliveredResponse = {
  status: 'OK'
  /**
   * Receiver's display name.
   *
   * @example
   *
   * "Aotoki"
   */
  user_id: string
}

export type PuzzleItemStat = {
  puzzle: string
  quantity: number
  currency: number
}

export type PuzzleStats = PuzzleItemStat[]
