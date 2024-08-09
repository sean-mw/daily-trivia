import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const { id, attempts, averageScore } = await req.json()
  const questionGroup = await prisma.dailyQuestionGroup.update({
    where: { id },
    data: { attempts, averageScore },
  })
  return NextResponse.json(questionGroup)
}
