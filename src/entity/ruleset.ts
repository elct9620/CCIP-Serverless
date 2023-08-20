export type RulesetAttribute = {
	eventId: string
	name: string
}

export class Ruleset {
	public readonly eventId: string
	public readonly name: string

	constructor({ eventId, name }: RulesetAttribute) {
		this.eventId = eventId
		this.name = name
	}
}
