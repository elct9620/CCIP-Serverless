import { Attendee, ConditionType } from '../model'

const ConditionHandler = {
	[ConditionType.Empty]: (attendee: Attendee, ...args: any[]): boolean => true,
	[ConditionType.AttendeeAttribute]: (attendee: Attendee, ...args: any[]): boolean => {
		return attendee.getMetadata(args[0] as string) === (args[1] as string)
	},
}

const defaultConditionHandler = (attendee: Attendee, ...args: any[]): boolean => false

export function getConditionHandler(type: ConditionType) {
	return ConditionHandler[type] ?? defaultConditionHandler
}
