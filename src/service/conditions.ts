import { Attendee, Condition, ConditionType } from '../model'

type ConditionHandler = (attendee: Attendee, ...args: any[]) => boolean

const ConditionHandler = {
	[ConditionType.Empty]: (attendee: Attendee, ...args: any[]): boolean => true,
	[ConditionType.And]: (attendee: Attendee, ...args: any[]): boolean => {
		for (const condition of args) {
			const handler = getConditionHandler(condition.type)
			if (!handler(attendee, ...condition.args)) {
				return false
			}
		}

		return true
	},
	[ConditionType.Or]: (attendee: Attendee, ...args: any[]): boolean => {
		for (const condition of args) {
			const handler = getConditionHandler(condition.type)
			if (handler(attendee, ...condition.args)) {
				return true
			}
		}

		return false
	},
	[ConditionType.Attribute]: (attendee: Attendee, ...args: any[]): boolean => {
		return attendee.getMetadata(args[0] as string) === (args[1] as string)
	},
	[ConditionType.UsedScenario]: (attendee: Attendee, ...args: any[]): boolean => {
		return attendee.isUsedScenario(args[0] as string)
	},
}

const defaultConditionHandler = (attendee: Attendee, ...args: any[]): boolean => false

function getConditionHandler(type: ConditionType) {
	return ConditionHandler[type] ?? defaultConditionHandler
}

export async function executeCondition(attendee: Attendee, condition: Condition): Promise<void> {
	const handler = getConditionHandler(condition.type)
	if (handler(attendee, ...condition.args)) {
		return
	}

	throw new Error(condition.reason ?? '')
}
