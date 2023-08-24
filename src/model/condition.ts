export enum ConditionType {
	Empty = 'Empty',
	And = 'And',
	Or = 'Or',
	Attribute = 'Attribute',
}

export class Condition {
	static empty(): Condition {
		return new Condition(ConditionType.Empty, [])
	}

	public readonly type: ConditionType
	public readonly args: any[]
	public readonly reason?: string

	constructor(type: ConditionType, args: any[], reason?: string) {
		this.type = type
		this.args = args
		this.reason = reason
	}
}
