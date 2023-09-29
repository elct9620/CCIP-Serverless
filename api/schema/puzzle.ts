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
