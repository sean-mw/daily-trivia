import { useState, useCallback } from 'react'
import { DailyQuestionGroup, Question } from '@prisma/client'
import QuizMenu from './QuizMenu'
import QuizResults from './QuizResults'
import QuizAnswers from './QuizAnswers'
import QuizTimer from './QuizTimer'
import useBreakpoint, { Breakpoint } from '@/app/hooks/useBreakpoint'

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
  const breakpoint = useBreakpoint()
  const questionSize = breakpoint === Breakpoint.SMALL ? 'text-2xl' : 'text-4xl'
  const gap = breakpoint === Breakpoint.SMALL ? 'gap-5' : 'gap-10'

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
        <div className={`flex flex-col h-screen p-5 ${gap}`}>
          <div
            className={`flex flex-col flex-grow justify-evenly items-center ${gap}`}
          >
            <div>
              <QuizTimer
                onTimeExpired={() => setQuizState(QuizState.RESULTS)}
              />
            </div>
            <div className={`${questionSize} font-bold text-center`}>
              {questionGroup.questions[currentQuestionIndex].question}
            </div>
          </div>
          <div className={`flex flex-col items-center w-full self-end ${gap}`}>
            <QuizAnswers
              question={questionGroup.questions[currentQuestionIndex]}
              onAnswer={onAnswer}
            />
            <div className="text-xl font-bold text-black text-opacity-40">
              {questionGroup.questions.length - 1 - currentQuestionIndex}{' '}
              questions remaining
            </div>
          </div>
        </div>
      )
    case QuizState.RESULTS:
      return <QuizResults score={score} questionGroup={questionGroup} />
  }
}

export default Quiz
