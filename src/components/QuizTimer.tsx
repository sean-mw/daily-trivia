import { useEffect, useState } from 'react'

const TIME_LIMIT = 60
const TIME_WARNING = 10

type QuizTimerProps = {
  onTimeExpired: () => void
}

const QuizTimer: React.FC<QuizTimerProps> = ({ onTimeExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT)
  const [timeColor, setTimeColor] = useState('text-black')

  useEffect(() => {
    const timeStarted = new Date()

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (new Date().getTime() - timeStarted.getTime()) / 1000
      )
      setTimeRemaining(TIME_LIMIT - elapsedSeconds)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeExpired()
    } else if (timeRemaining <= TIME_WARNING) {
      setTimeColor('text-red-600')
    } else {
      setTimeColor('text-black')
    }
  }, [timeRemaining, onTimeExpired])

  return (
    <div className={`text-6xl font-bold ${timeColor}`}>{timeRemaining}</div>
  )
}

export default QuizTimer
