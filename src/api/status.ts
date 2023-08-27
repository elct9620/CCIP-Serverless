import { IRequest, StatusError } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo, AttendeeAccess } from '../usecase'
import { datetimeToUnix } from '../helper'

export type StatusRequest = {
	attendeeInfo: AttendeeInfo
	attendeeAccess: AttendeeAccess
} & IRequest

export type StatusResponse = {
	event_id: string
	user_id: string
	first_use: number | null
	role: string
	scenario: Record<string, any>
	attr: Record<string, any>
}

export const status = async ({ attendeeInfo, attendeeAccess, query }: StatusRequest) => {
	if (!query.token) {
		throw new StatusError(400, 'token required')
	}

	const isStaffQuery = query.StaffQuery === 'true'
	const info = await attendeeInfo.getAttendee(query.token as string, !isStaffQuery)
	if (!info) {
		throw new StatusError(400, 'invalid token')
	}

	const scenarios = await attendeeAccess.getScenarios(query.token as string)

	return json<StatusResponse>({
		event_id: info.eventId,
		user_id: info.displayName,
		first_use: datetimeToUnix(info.firstUsedAt),
		role: info.role,
		scenario: formatScenario(scenarios),
		attr: info.metadata ?? {},
	})
}

function formatScenario(scenario: Record<string, any>) {
	const result: Record<string, any> = {}
	for (const key in scenario) {
		const value = scenario[key]
		result[key] = {
			order: value.order,
			available_time: datetimeToUnix(value.availableTime.start),
			expire_time: datetimeToUnix(value.availableTime.end),
			display_text: value.displayText,
			disabled: value.locked ? value.lockReason : null,
			attr: value.metadata,
		}
	}
	return result
}
