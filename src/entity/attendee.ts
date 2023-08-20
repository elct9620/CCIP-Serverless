type AttendeeAttributes = {
	token: string
	displayName: string
	firstUsedAt?: Date
}

export class Attendee {
	public readonly token: string
	public readonly displayName: string

	private _firstUsedAt: Date | null = null

	constructor(attributes: AttendeeAttributes) {
		this.token = attributes.token
		this.displayName = attributes.displayName
		this._firstUsedAt = attributes.firstUsedAt ?? null
	}

	get firstUsedAt(): Date | null {
		return this._firstUsedAt
	}

	touch(): void {
		if (!this._firstUsedAt) {
			this._firstUsedAt = new Date()
		}
	}
}
