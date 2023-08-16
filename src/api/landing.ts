import {
	json,
	error,
	IRequest
} from 'itty-router'
import { AttendeeInfo } from '../usecase'

export function Landing(usecase: AttendeeInfo) {
	return async ({ query }: IRequest) => {
		if (!query.token) {
			return error(400, { message: 'invalid token' })
		}

		const info = await usecase.GetAttendee(query.token as string)

		return json({nickname: info.nickname})
	}
}
