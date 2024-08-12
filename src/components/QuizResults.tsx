'use client'

import { DailyQuestionGroup, Question } from '@prisma/client'
import axios from 'axios'
import { useEffect } from 'react'

type QuizResultsProps = {
  score: number
  questionGroup: DailyQuestionGroup & { questions: Question[] }
}

const QuizResults: React.FC<QuizResultsProps> = ({ score, questionGroup }) => {
  useEffect(() => {
    axios.patch('/api/questionGroup', {
      id: questionGroup.id,
      score,
    })
  }, [questionGroup.id, score])

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 py-10 px-5">
      <div className="text-3xl font-bold">
        Score: {score} / {questionGroup.questions.length}
      </div>
      <div className="text-xl font-bold text-center">
        {questionGroup.attempts} attempts have been made today. The average
        score is {questionGroup.averageScore.toFixed(1)}.
      </div>
      <div className="text-xl font-bold text-center">
        Come back tomorrow for another set of questions!
      </div>
    </div>
  )
}

export default QuizResults
