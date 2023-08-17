import { IRequest } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo } from '../usecase'

export type LandingRequest = {
	attendeeInfo: AttendeeInfo
} & IRequest

export type LandingResponse = {
	nickname: string
}

export const Landing =  async ({ attendeeInfo, query }: LandingRequest) => {
	if (!query.token) {
		return error(400, 'invalid token')
	}

	const info = await attendeeInfo.GetAttendee(query.token as string)
	if (!info) {
		return error(400, 'invalid token')
	}

	return json<LandingResponse>({nickname: info.nickname})
}
