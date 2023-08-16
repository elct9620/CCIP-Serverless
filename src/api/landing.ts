import {
	json,
	error,
	IRequest
} from 'itty-router'

export function Landing({ query }: IRequest) {
	if (!query.token) {
		return error(400, { message: 'invalid token' })
	}

	return json({nickname: 'Aotoki'})
}
