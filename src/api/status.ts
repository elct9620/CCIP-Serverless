import { IRequest, StatusError } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo, AttendeeScenario } from '../usecase'

export type StatusRequest = {
	attendeeInfo: AttendeeInfo
} & IRequest

export type StatusResponse = {
	event_id: string
	user_id: string
	first_use: number | null
	role: string
	scenario: Record<string, any>
	attr: Record<string, any>
}

const datetimeToUnix = (datetime: Date | null): number | null => {
	if (!datetime) {
		return null
	}

	return datetime.getTime() / 1000
}

export const status = async ({ attendeeInfo, query }: StatusRequest) => {
	if (!query.token) {
		throw new StatusError(400, 'token required')
	}

	const isStaffQuery = query.StaffQuery === 'true'
	const info = await attendeeInfo.getAttendee(query.token as string, !isStaffQuery)
	if (!info) {
		throw new StatusError(400, 'invalid token')
	}

	return json<StatusResponse>({
		event_id: info.eventId,
		user_id: info.displayName,
		first_use: datetimeToUnix(info.firstUsedAt),
		role: info.role,
		scenario: formatScenario(info.scenario),
		attr: info.metadata ?? {},
	})
}

function formatScenario(scenario: Record<string, AttendeeScenario>) {
	const result: Record<string, any> = {}
	for (const key in scenario) {
		const value = scenario[key]
		result[key] = {
			order: value.order,
			display_text: value.displayText,
			disabled: value.locked ? value.lockReason : null,
		}
	}
	return result
}
