export enum ConditionType {
	AttendeeAttribute = 'AttendeeAttribute',
}

export class Condition {
	public readonly type: ConditionType
	public readonly args: any[]
	public readonly reason?: string

	constructor(type: ConditionType, args: any[], reason?: string) {
		this.type = type
		this.args = args
		this.reason = reason
	}
}
