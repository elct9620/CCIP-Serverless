import { IRequest } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo } from '../usecase'

export type LandingResponse = {
	nickname: string
}

export function Landing(usecase: AttendeeInfo) {
	return async ({ query }: IRequest) => {
		if (!query.token) {
			return error(400, 'invalid token')
		}

		const info = await usecase.GetAttendee(query.token as string)

		return json<LandingResponse>({nickname: info.nickname})
	}
}
