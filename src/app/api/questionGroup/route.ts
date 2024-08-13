import { getDayMonthYear } from '@/lib/date-util'
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { day, month, year } = getDayMonthYear(
    new Date(),
    'America/Los_Angeles'
  )

  const questionGroup = await prisma.dailyQuestionGroup.findUnique({
    where: { day_month_year_unique: { year, month, day } },
    include: { questions: true },
  })

  return NextResponse.json(questionGroup)
}

export async function PATCH(req: NextRequest) {
  const { id, score } = await req.json()

  const questionGroup = await prisma.dailyQuestionGroup.findUnique({
    where: { id },
  })

  if (!questionGroup) {
    return NextResponse.json(
      { error: 'Question group not found' },
      { status: 404 }
    )
  }

  const averageScore =
    (questionGroup.averageScore * questionGroup.attempts + score) /
    (questionGroup.attempts + 1)

  const updatedQuestionGroup = await prisma.dailyQuestionGroup.update({
    where: { id },
    data: { attempts: questionGroup.attempts + 1, averageScore },
  })
  return NextResponse.json(updatedQuestionGroup)
}
