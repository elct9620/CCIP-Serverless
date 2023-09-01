import { IRequest, StatusError } from 'itty-router'
import { json, error } from '@worker/utils'
import * as schema from '@api/schema'
import { AttendeeInfo } from '@api/usecase'

export type LandingRequest = {
  attendeeInfo: AttendeeInfo
} & IRequest

export type LandingResponse = schema.BasicAttendeeInfo

export const landing = async ({ attendeeInfo, query }: LandingRequest) => {
  if (!query.token) {
    throw new StatusError(400, 'token required')
  }

  const info = await attendeeInfo.getAttendee(query.token as string)
  if (!info) {
    throw new StatusError(400, 'invalid token')
  }

  return json<LandingResponse>({ nickname: info.displayName })
}
