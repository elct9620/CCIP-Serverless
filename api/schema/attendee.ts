import { z } from 'zod'

export type AttendeeMetadata = z.infer<typeof attendeeMetadataSchema>
export const attendeeMetadataSchema = z.record(z.any())

export type BasicAttendeeInfo = z.infer<typeof basicAttendeeInfoSchema>
export const basicAttendeeInfoSchema = z.object({
  nickname: z.string()
})
