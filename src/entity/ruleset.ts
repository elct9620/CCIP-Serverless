export type RulesetAttribute = {
	eventId: string
	name: string
	scenarios?: Record<string, any>
}

export class Ruleset {
	public readonly eventId: string
	public readonly name: string
	public readonly scenarios?: Record<string, any>

	constructor(attributes: RulesetAttribute) {
		this.eventId = attributes.eventId
		this.name = attributes.name
		this.scenarios = attributes.scenarios || {}
	}
}
