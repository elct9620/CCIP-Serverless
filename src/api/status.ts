import { IRequest, StatusError } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo } from '../usecase'

export type StatusRequest = {
	attendeeInfo: AttendeeInfo
} & IRequest

export type StatusResponse = {
	user_id: string
	first_use: number
}

export const status = async ({ attendeeInfo, query }: StatusRequest) => {
	if (!query.token) {
		throw new StatusError(400, 'token required')
	}

	const info = await attendeeInfo.getAttendee(query.token as string)
	if (!info) {
		throw new StatusError(400, 'invalid token')
	}

	return json<StatusResponse>({
		user_id: info.nickname,
		first_use: info.firstUsedAt.getTime(),
	})
}
