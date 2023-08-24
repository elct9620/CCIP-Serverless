import { IRequest, StatusError } from 'itty-router'
import { json, error } from './helper'
import { AttendeeInfo, AttendeeScenario } from '../usecase'
import { datetimeToUnix } from '../helper'

export type UseRequest = {
	attendeeInfo: AttendeeInfo
	scenarioId: string
} & IRequest

export type UseResponse = {
	event_id: string
	user_id: string
	first_use: number | null
	role: string
	scenario: Record<string, any>
	attr: Record<string, any>
}

export const use = async ({ attendeeInfo, scenarioId, query }: UseRequest) => {
	if (!query.token) {
		throw new StatusError(400, 'token required')
	}

	const res = await attendeeInfo.useScenario(query.token as string, scenarioId)
	if (!res) {
		throw new StatusError(400, 'invalid token')
	}

	return json<UseResponse>({
		event_id: res.eventId,
		user_id: res.displayName,
		first_use: datetimeToUnix(res.firstUsedAt),
		role: res.role,
		scenario: formatScenario(res.scenario),
		attr: res.metadata ?? {},
	})
}

function formatScenario(scenario: Record<string, AttendeeScenario>) {
	const result: Record<string, any> = {}
	for (const key in scenario) {
		const value = scenario[key]
		result[key] = {
			order: value.order,
			used: 0,
			display_text: value.displayText,
			disabled: value.locked ? value.lockReason : null,
		}
	}
	return result
}
