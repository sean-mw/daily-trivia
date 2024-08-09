import Quiz from '@/components/Quiz'
import prisma from '@/lib/prisma'

const options: Intl.DateTimeFormatOptions = {
  timeZone: 'America/Los_Angeles',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
}
const formatter = new Intl.DateTimeFormat('en-US', options)

export default async function Game() {
  const now = new Date()
  const [month, day, year] = formatter.format(now).split('/').map(Number)

  const questionGroup = await prisma.dailyQuestionGroup.findUnique({
    where: { day_month_year_unique: { year, month: month - 1, day } }, // subtract 1 so that month is 0-indexed
    include: { questions: true },
  })

  if (!questionGroup) {
    // TODO: Handle this case (create error page?)
    return <div>No question group found</div>
  }

  return (
    <main>
      <Quiz questionGroup={questionGroup} />
    </main>
  )
}
