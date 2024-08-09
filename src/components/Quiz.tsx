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
import useBreakpoint, { Breakpoint } from '@/app/hooks/useBreakpoint'
import { DailyQuestionGroup } from '@prisma/client'
import axios from 'axios'

type QuizProps = {
  questionGroup: DailyQuestionGroup & { questions: Question[] }
}

enum QuizState {
  MENU,
  PLAYING,
  RESULTS,
}

const TIME_LIMIT = 60

const Quiz: React.FC<QuizProps> = ({ questionGroup }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>()
  const [timeStarted, setTimeStarted] = useState<Date>()
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT)
  const [timeColor, setTimeColor] = useState('text-black')
  const [quizState, setQuizState] = useState(QuizState.MENU)
  const breakpoint = useBreakpoint()

  const handleAnswerSubmit = useCallback(
    (answer: string) => {
      if (quizState !== QuizState.PLAYING) return
      if (selectedAnswer) return
      setSelectedAnswer(answer)
      const correctAnswer =
        questionGroup.questions[currentQuestionIndex].correctAnswer
      if (answer === correctAnswer) {
        setScore(score + 1)
      }
      setTimeout(() => {
        setSelectedAnswer(undefined)
        const nextQuestionIndex = currentQuestionIndex + 1
        if (nextQuestionIndex >= questionGroup.questions.length) {
          setQuizState(QuizState.RESULTS)
          return
        }
        setCurrentQuestionIndex(nextQuestionIndex)
      }, 1000)
    },
    [
      currentQuestionIndex,
      questionGroup.questions,
      quizState,
      score,
      selectedAnswer,
    ]
  )

  const currentAnswers = useMemo(() => {
    const question = questionGroup.questions[currentQuestionIndex]
    if (!question) return []
    const answers = questionGroup.questions[currentQuestionIndex].answers
    return answers.sort((a, b) => b.length - a.length)
  }, [currentQuestionIndex, questionGroup.questions])

  useEffect(() => {
    if (quizState !== QuizState.PLAYING) return

    const interval = setInterval(() => {
      if (!timeStarted) return

      setTimeRemaining(
        TIME_LIMIT -
          Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000)
      )
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [quizState, timeStarted])

  useEffect(() => {
    if (quizState !== QuizState.PLAYING) return

    if (timeRemaining <= 0) {
      setQuizState(QuizState.RESULTS)
    } else if (timeRemaining <= 10) {
      setTimeColor('text-red-600')
    } else {
      setTimeColor('text-black')
    }
  }, [timeRemaining, questionGroup.questions.length, quizState])

  useEffect(() => {
    if (quizState !== QuizState.PLAYING) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (breakpoint === Breakpoint.SMALL || !arrowKeys.includes(event.key))
        return
      event.preventDefault()
      const index = arrowKeys.indexOf(event.key)
      handleAnswerSubmit(
        questionGroup.questions[currentQuestionIndex].answers[index]
      )
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    breakpoint,
    currentQuestionIndex,
    handleAnswerSubmit,
    questionGroup.questions,
    quizState,
    selectedAnswer,
  ])

  useEffect(() => {
    if (quizState === QuizState.RESULTS) {
      axios.patch('/api/questionGroup', {
        id: questionGroup.id,
        score,
      })
    }
  }, [questionGroup.id, quizState, score])

  const answerButton = (answer: string) => {
    let buttonColor
    if (selectedAnswer) {
      if (
        answer === questionGroup.questions[currentQuestionIndex].correctAnswer
      ) {
        buttonColor = 'bg-green-400'
      } else if (answer === selectedAnswer) {
        buttonColor = 'bg-red-400'
      } else {
        buttonColor = 'bg-gray-200'
      }
    }
    return (
      <Button
        onClick={() => !selectedAnswer && handleAnswerSubmit(answer)}
        className={`w-full ${buttonColor}`}
        disabled={!!selectedAnswer}
      >
        {answer.toUpperCase()}
      </Button>
    )
  }

  if (quizState === QuizState.MENU) {
    return (
      <div className="flex flex-col p-20 gap-10 items-center">
        <div className="text-3xl font-bold">Daily Trivia</div>
        <Button
          onClick={() => {
            setTimeStarted(new Date())
            setQuizState(QuizState.PLAYING)
          }}
        >
          START
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 py-10 px-5">
      {quizState === QuizState.PLAYING ? (
        <>
          <div className={`text-6xl font-bold ${timeColor}`}>
            {timeRemaining}
          </div>
          <div className="text-2xl font-bold text-center">
            {questionGroup.questions[currentQuestionIndex].question}
          </div>
          {breakpoint !== Breakpoint.SMALL ? (
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
          ) : (
            <div className="flex flex-col gap-2">
              {currentAnswers.map((answer) => answerButton(answer))}
            </div>
          )}
          <div className={`text-xl font-bold`}>
            {questionGroup.questions.length - 1 - currentQuestionIndex}{' '}
            questions remaining
          </div>
        </>
      ) : (
        <>
          <div className="text-3xl font-bold">
            Score: {score} / {questionGroup.questions.length}
          </div>
          <div className="text-xl font-bold text-center">
            {questionGroup.attempts} attempts have been made today. The average
            score is {questionGroup.averageScore.toFixed(1)}.
          </div>
          <div className="text-xl font-bold text-center">
            Come back tommorow for another set of questions!
          </div>
        </>
      )}
    </div>
  )
}

export default Quiz
