import useBreakpoint, { Breakpoint } from '@/app/hooks/useBreakpoint'
import Button from './Button'

import { useCallback, useEffect, useState } from 'react'
import { Question } from '@prisma/client'
import ArrowDiamond from './ArrowDiamond'

const ANSWER_DELAY = 1000
const ARROW_KEYS = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown']

type QuizAnswersProps = {
  question: Question
  onAnswer: (answer: string) => void
}

const QuizAnswers: React.FC<QuizAnswersProps> = ({ question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const breakpoint = useBreakpoint()

  const delayedAnswerHandler = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      setTimeout(() => {
        setSelectedAnswer(undefined)
        onAnswer(answer)
      }, ANSWER_DELAY)
    },
    [onAnswer]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ARROW_KEYS.includes(event.key)) {
        event.preventDefault()
      } else {
        return
      }
      if (breakpoint === Breakpoint.SMALL || !!selectedAnswer) {
        return
      }
      const index = ARROW_KEYS.indexOf(event.key)
      delayedAnswerHandler(question.answers[index])
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [breakpoint, delayedAnswerHandler, question.answers, selectedAnswer])

  const answerButton = (answer: string) => {
    let buttonColor
    if (selectedAnswer) {
      if (answer === question.correctAnswer) {
        buttonColor = 'bg-green-400'
      } else if (answer === selectedAnswer) {
        buttonColor = 'bg-red-400'
      } else {
        buttonColor = 'bg-gray-200'
      }
    }

    return (
      <Button
        onClick={() => !selectedAnswer && delayedAnswerHandler(answer)}
        className={`w-full ${buttonColor}`}
        disabled={!!selectedAnswer}
        key={`${answer.replace(' ', '-')}-button`}
      >
        {answer.toUpperCase()}
      </Button>
    )
  }

  return (
    <>
      {breakpoint !== Breakpoint.SMALL ? (
        <div className="relative grid grid-cols-3 grid-rows-3 gap-4">
          <div className="col-start-2 row-start-1 flex justify-center items-end">
            {answerButton(question.answers[0])}
          </div>
          <div className="col-start-1 row-start-2 flex justify-end items-center">
            {answerButton(question.answers[1])}
          </div>
          <div className="col-start-2 row-start-2 flex justify-center items-center">
            <ArrowDiamond />
          </div>
          <div className="col-start-3 row-start-2 flex justify-start items-center">
            {answerButton(question.answers[2])}
          </div>
          <div className="col-start-2 row-start-3 flex justify-center items-start">
            {answerButton(question.answers[3])}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          {question.answers.map((answer) => answerButton(answer))}
        </div>
      )}
    </>
  )
}

export default QuizAnswers
