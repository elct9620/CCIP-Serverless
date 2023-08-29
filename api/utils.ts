let fixedDatetime: Date | null = null

export const getCurrentTime = (): Date => {
  if (fixedDatetime) {
    return fixedDatetime
  }

  return new Date()
}

export const setFixedDatetime = (datetime: Date | null): void => {
  fixedDatetime = datetime
}

export function datetimeToUnix(datetime: null): null
export function datetimeToUnix(datetime: Date): number
export function datetimeToUnix(datetime: Date | null): number | null {
  if (!datetime) {
    return null
  }

  return Math.floor(datetime.getTime() / 1000)
}
