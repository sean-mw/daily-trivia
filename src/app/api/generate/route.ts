import { NextRequest, NextResponse } from 'next/server'
import { addDays } from '@/lib/date-util'
import {
  deleteOutdatedQuestionGroups,
  generateQuestionGroup,
} from '@/lib/question-group'
import prisma from '@/lib/prisma'

// Route for cron job to generate daily trivia questions for the next week.
export async function GET(req: NextRequest) {
  if (
    req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json('Unauthorized', { status: 401 })
  }

  try {
    const today = new Date()
    const lastWeek = addDays(today, -7)

    await deleteOutdatedQuestionGroups(lastWeek)

    const existingQuestionGroups = await prisma.dailyQuestionGroup.findMany()
    const existingDates = new Set(
      existingQuestionGroups.map(
        (group) => `${group.year}-${group.month}-${group.day}`
      )
    )

    const daysThisWeek = Array.from({ length: 7 }, (_, i) => addDays(today, i))
    const daysWithoutQuestionGroups = daysThisWeek.filter(
      (day) =>
        !existingDates.has(
          `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
        )
    )

    await Promise.all(daysWithoutQuestionGroups.map(generateQuestionGroup))

    return NextResponse.json('Successfully generated new question group(s).', {
      status: 200,
    })
  } catch (error) {
    console.error('Error generating question group:', error)
    return NextResponse.json(
      { error: 'Failed to generate question group.' },
      { status: 500 }
    )
  }
}
