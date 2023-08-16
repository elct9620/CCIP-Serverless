export class Attendee {
	public readonly token: string;
	public readonly userId: string;

	constructor(token: string, userId: string) {
		this.token = token;
		this.userId = userId;
	}
}
