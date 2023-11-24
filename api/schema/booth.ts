import { z } from "zod"

export type BoothList = z.infer<typeof boothListSchema>
export const boothListSchema = z.array(z.string())

export type BoothStaff = z.infer<typeof boothStaffSchema>
export const boothStaffSchema = z.object({
  slug: z.string()
})
