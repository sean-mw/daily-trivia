'use client'

import Quiz from '@/components/Quiz'
import { useEffect, useState } from 'react'
import { DailyQuestionGroup, Question } from '@prisma/client'
import axios from 'axios'

export default function Game() {
  const [questionGroup, setQuestionGroup] = useState<
    DailyQuestionGroup & { questions: Question[] }
  >()

  useEffect(() => {
    const getQuestionGroup = async () => {
      const questionGroup = await axios.get('/api/questionGroup')
      setQuestionGroup(questionGroup.data)
    }

    getQuestionGroup()
  }, [])

  return (
    <main>
      {!!questionGroup ? (
        <Quiz questionGroup={questionGroup} />
      ) : (
        <div className="flex flex-col justify-center items-center h-[calc(100dvh)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black" />
          <p className="mt-4 text-lg font-bold">
            Loading questions, please wait...
          </p>
        </div>
      )}
    </main>
  )
}
