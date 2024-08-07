import Quiz from '@/components/Quiz'
import prisma from '@/lib/prisma'

export default async function Game() {
  const now = new Date()
  const month = now.getMonth()
  const day = now.getDate()

  const questionGroup = await prisma.dailyQuestionGroup.findUnique({
    where: { month_day_unique: { month, day } },
    include: { questions: true },
  })

  if (!questionGroup) {
    // TODO: Handle this case (create error page?)
    return <div>No question group found</div>
  }

  return (
    <main>
      <Quiz questions={questionGroup.questions} />
    </main>
  )
}
