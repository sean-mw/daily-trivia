'use client'

import Question from '@/types/question'
import { useState, useCallback } from 'react'
import { DailyQuestionGroup } from '@prisma/client'
import QuizMenu from './QuizMenu'
import QuizResults from './QuizResults'
import QuizQuestion from './QuizQuestion'
import QuizTimer from './QuizTimer'

type QuizProps = {
  questionGroup: DailyQuestionGroup & { questions: Question[] }
}

enum QuizState {
  MENU,
  PLAYING,
  RESULTS,
}

const Quiz: React.FC<QuizProps> = ({ questionGroup }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizState, setQuizState] = useState(QuizState.MENU)

  const onAnswer = useCallback(
    (answer: string) => {
      if (
        answer === questionGroup.questions[currentQuestionIndex].correctAnswer
      ) {
        setScore(score + 1)
      }
      const nextQuestionIndex = currentQuestionIndex + 1
      if (nextQuestionIndex >= questionGroup.questions.length) {
        setQuizState(QuizState.RESULTS)
        return
      }
      setCurrentQuestionIndex(nextQuestionIndex)
    },
    [currentQuestionIndex, questionGroup.questions, score]
  )

  switch (quizState) {
    case QuizState.MENU:
      return (
        <QuizMenu
          onStart={() => {
            setQuizState(QuizState.PLAYING)
          }}
        />
      )
    case QuizState.PLAYING:
      return (
        <div className="flex min-h-screen flex-col items-center gap-10 py-10 px-5">
          <QuizTimer onTimeExpired={() => setQuizState(QuizState.RESULTS)} />
          <QuizQuestion
            question={questionGroup.questions[currentQuestionIndex]}
            onAnswer={onAnswer}
          />
          <div className={`text-xl font-bold`}>
            {questionGroup.questions.length - 1 - currentQuestionIndex}{' '}
            questions remaining
          </div>
        </div>
      )
    case QuizState.RESULTS:
      return <QuizResults score={score} questionGroup={questionGroup} />
  }
}

export default Quiz
