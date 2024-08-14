'use client'

import useBreakpoint, { Breakpoint } from '@/app/hooks/useBreakpoint'
import { DailyQuestionGroup, Question } from '@prisma/client'
import axios from 'axios'
import { useEffect } from 'react'

type QuizResultsProps = {
  score: number
  questionGroup: DailyQuestionGroup & { questions: Question[] }
}

const QuizResults: React.FC<QuizResultsProps> = ({ score, questionGroup }) => {
  const breakpoint = useBreakpoint()
  const scoreSize = breakpoint === Breakpoint.SMALL ? 'text-4xl' : 'text-6xl'
  const textSize = breakpoint === Breakpoint.SMALL ? 'text-2xl' : 'text-4xl'

  useEffect(() => {
    axios.patch('/api/questionGroup', {
      id: questionGroup.id,
      score,
    })
  }, [questionGroup.id, score])

  return (
    <div className="flex flex-col h-[calc(100dvh)] items-center justify-center gap-10 px-5 py-10">
      <div className={`${scoreSize} font-bold`}>
        Score: {score} / {questionGroup.questions.length}
      </div>
      <div className="gap-5">
        <div className={`${textSize} text-center`}>
          The average score for today is{' '}
          <span className="font-bold">
            {questionGroup.averageScore.toFixed(1)}{' '}
          </span>
          across <span className="font-bold">{questionGroup.attempts} </span>
          users.
        </div>
        <div className={`${textSize} text-center`}>
          Come back tomorrow for another set of questions!
        </div>
      </div>
    </div>
  )
}

export default QuizResults
