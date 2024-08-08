'use client'

import Question from '@/types/question'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import Button from './Button'

type QuizProps = {
  questions: Question[]
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()

  const handleAnswerSubmit = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer)
      const correctAnswer = questions[currentQuestionIndex].correctAnswer
      if (answer === correctAnswer) {
        setScore(score + 1)
      }
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(undefined)
      }, 1000)
    },
    [currentQuestionIndex, questions, score]
  )

  const currentAnswers = useMemo(() => {
    const question = questions[currentQuestionIndex]
    if (!question) return []
    const answers = questions[currentQuestionIndex].answers
    return answers.sort((a, b) => b.length - a.length)
  }, [currentQuestionIndex, questions])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (!arrowKeys.includes(event.key)) return
      event.preventDefault()
      const endOfQuiz = currentQuestionIndex >= questions.length
      if (endOfQuiz || selectedAnswer) {
        return
      }
      const index = arrowKeys.indexOf(event.key)
      handleAnswerSubmit(questions[currentQuestionIndex].answers[index])
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentQuestionIndex, handleAnswerSubmit, questions, selectedAnswer])

  const answerButton = (answer: string) => {
    let buttonClass = 'w-full'
    if (selectedAnswer) {
      if (answer === questions[currentQuestionIndex].correctAnswer) {
        buttonClass += ' bg-green-400'
      } else if (answer === selectedAnswer) {
        buttonClass += ' bg-red-400'
      } else {
        buttonClass += ' bg-gray-200'
      }
    } else {
      buttonClass += ' hover:bg-gray-200'
    }
    return (
      <Button
        onClick={() => !selectedAnswer && handleAnswerSubmit(answer)}
        className={buttonClass}
        disabled={!!selectedAnswer}
      >
        {answer.toUpperCase()}
      </Button>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 py-10 px-5">
      <h2 className="text-3xl font-bold">
        SCORE: {score} / {questions.length}
      </h2>
      {currentQuestionIndex < questions.length ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">
            {questions[currentQuestionIndex].question}
          </h2>
          <div className="relative grid grid-cols-3 grid-rows-3 gap-4">
            <div className="col-start-2 row-start-1 flex justify-center items-end">
              {answerButton(currentAnswers[0])}
            </div>
            <div className="col-start-1 row-start-2 flex justify-end items-center">
              {answerButton(currentAnswers[2])}
            </div>
            <div className="col-start-2 row-start-2 flex justify-center items-center">
              <div className="flex flex-col items-center">
                <FontAwesomeIcon
                  icon={faAngleUp}
                  size="2x"
                  className="text-black"
                />
                <div className="flex gap-10">
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    size="2x"
                    className="text-black"
                  />
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    size="2x"
                    className="text-black"
                  />
                </div>
                <FontAwesomeIcon
                  icon={faAngleDown}
                  size="2x"
                  className="text-black"
                />
              </div>
            </div>
            <div className="col-start-3 row-start-2 flex justify-start items-center">
              {answerButton(currentAnswers[3])}
            </div>
            <div className="col-start-2 row-start-3 flex justify-center items-start">
              {answerButton(currentAnswers[1])}
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => {
            setCurrentQuestionIndex(0)
            setScore(0)
          }}
        >
          RESTART
        </Button>
      )}
    </div>
  )
}

export default Quiz
