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
