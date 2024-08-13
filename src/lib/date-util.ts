export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getDayMonthYear(
  date: Date,
  timeZone: string
): {
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
  const [month, day, year] = formatter.format(date).split('/').map(Number)
  return { day, month: month - 1, year } // subtract 1 so that month is 0-indexed
}
