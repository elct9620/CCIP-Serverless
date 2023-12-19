import { z } from 'zod'

export type PuzzleStatus = z.infer<typeof puzzleStatusSchema>

export const puzzleStatusSchema = z.object({
  user_id: z.string().default('user1234'),
  puzzles: z.array(z.string().default('a')),
  deliverers: z.array(z.string().default('OCF')),
  valid: z.number().nullable(),
  coupon: z.number().nullable(),
})

export type DeliverPuzzlePayload = {
  receiver: string
}

export type PuzzleDeliveredResponse = z.infer<typeof puzzleDeliveredResponseSchema>
export const puzzleDeliveredResponseSchema = z.object({
  status: z.string().default('OK'),
  user_id: z.string().default('user1234'),
})

export type PuzzleItemStat = z.infer<typeof puzzleItemStatSchema>
export const puzzleItemStatSchema = z.object({
  puzzle: z.string().default('a'),
  quantity: z.number().default(1234),
  currency: z.number().default(5678),
})

export type PuzzleStats = z.infer<typeof puzzleStatsSchema>
export const puzzleStatsSchema = z.array(puzzleItemStatSchema)

export const puzzleRevokeResponseSchema = z.object({
  status: z.string().default('OK'),
})
