export const datetimeToUnix = (datetime: Date | null): number | null => {
	if (!datetime) {
		return null
	}

	return datetime.getTime() / 1000
}
