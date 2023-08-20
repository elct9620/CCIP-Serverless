type AttendeeAttributes = {
	token: string
	eventId: string
	displayName: string
	firstUsedAt?: Date
	role: AttendeeRole
}

export enum AttendeeRole {
	Audience = 'audience',
	Staff = 'staff',
}

export class Attendee {
	public readonly token: string
	public readonly eventId: string
	public readonly displayName: string
	public readonly role: AttendeeRole = AttendeeRole.Audience

	private _firstUsedAt: Date | null = null

	constructor(attributes: AttendeeAttributes) {
		this.token = attributes.token
		this.eventId = attributes.eventId
		this.displayName = attributes.displayName
		this.role = attributes.role
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
