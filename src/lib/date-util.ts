export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getCurrentDayMonthYear(timeZone: string): {
  day: number
  month: number
  year: number
} {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat('en-US', options)
  const now = new Date()
  const [month, day, year] = formatter.format(now).split('/').map(Number)
  return { day, month: month - 1, year } // subtract 1 so that month is 0-indexed
}
