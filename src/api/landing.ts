import { IRequest, StatusError } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo } from '../usecase'

export type LandingRequest = {
	attendeeInfo: AttendeeInfo
} & IRequest

export type LandingResponse = {
	nickname: string
}

export const Landing = async ({ attendeeInfo, query }: LandingRequest) => {
	if (!query.token) {
		throw new StatusError(400, 'token required')
	}

	const info = await attendeeInfo.GetAttendee(query.token as string)
	if (!info) {
		throw new StatusError(400, 'invalid token')
	}

	return json<LandingResponse>({ nickname: info.nickname })
}
