'use client'

import Question from '@/types/question'
import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const arrowKeys = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown']
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
    let buttonClass =
      'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10'
    if (selectedAnswer) {
      if (answer === questions[currentQuestionIndex].correctAnswer) {
        buttonClass = 'bg-green-500 text-white font-bold py-2 px-4 rounded h-10'
      } else if (answer === selectedAnswer) {
        buttonClass = 'bg-red-500 text-white font-bold py-2 px-4 rounded h-10'
      } else {
        buttonClass = 'bg-gray-500 text-white font-bold py-2 px-4 rounded h-10'
      }
    }
    return (
      <button
        className={buttonClass}
        onClick={() => !selectedAnswer && handleAnswerSubmit(answer)}
        disabled={!!selectedAnswer}
      >
        {answer.toUpperCase()}
      </button>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 py-20 px-10">
      <h2 className="text-2xl font-bold">
        SCORE: {score} / {questions.length}
      </h2>
      {currentQuestionIndex < questions.length ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">
            {questions[currentQuestionIndex].question}
          </h2>
          <div className="relative grid grid-cols-3 grid-rows-3 gap-4">
            <div className="col-start-2 row-start-1 flex justify-center items-end">
              {answerButton(questions[currentQuestionIndex].answers[0])}
            </div>
            <div className="col-start-1 row-start-2 flex justify-end items-center">
              {answerButton(questions[currentQuestionIndex].answers[1])}
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
              {answerButton(questions[currentQuestionIndex].answers[2])}
            </div>
            <div className="col-start-2 row-start-3 flex justify-center items-start">
              {answerButton(questions[currentQuestionIndex].answers[3])}
            </div>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setCurrentQuestionIndex(0)
            setScore(0)
          }}
        >
          RESTART
        </button>
      )}
    </div>
  )
}

export default Quiz
