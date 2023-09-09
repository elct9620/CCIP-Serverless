export function datetimeToUnix(datetime: Date): number
export function datetimeToUnix(datetime: null): null
export function datetimeToUnix(datetime: Date | null): number | null
export function datetimeToUnix(datetime: Date | null): number | null {
  if (!datetime) {
    return null
  }

  return Math.floor(datetime.getTime() / 1000)
}
