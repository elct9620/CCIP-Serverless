import { Attendee, ConditionType } from '../model'

const ConditionHandler = {
	[ConditionType.AttendeeAttribute]: (attendee: Attendee, ...args: any[]): boolean => {
		return attendee.getMetadata(args[0] as string) === (args[1] as string)
	},
}

const defaultConditionHandler =
	(defaultValue: boolean) =>
	(attendee: Attendee, ...args: any[]): boolean => {
		return false
	}

export function getConditionHandler(type: ConditionType, defaultVal: boolean = false) {
	return ConditionHandler[type] ?? defaultConditionHandler(defaultVal)
}
