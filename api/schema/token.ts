import { z } from 'zod'

export const OptionalAttendeeTokenQuery = z
  .string({
    description: 'the attendee token',
  })
  .optional()

export const OptionalDelivererTokenQuery = z
  .string({
    description: 'the deliverer token',
  })
  .optional()

export const OptionalPublicTokenQuery = z
  .string({
    description: 'the attendee public token',
  })
  .optional()
