import useBreakpoint, { Breakpoint } from '@/app/hooks/useBreakpoint'
import { useEffect, useState } from 'react'

const TIME_LIMIT = 60
const TIME_WARNING = 10

type QuizTimerProps = {
  onTimeExpired: () => void
}

const QuizTimer: React.FC<QuizTimerProps> = ({ onTimeExpired }) => {
  const [seconds, setSeconds] = useState(TIME_LIMIT % 60)
  const [minutes, setMinutes] = useState(Math.floor(TIME_LIMIT / 60))
  const [timeColor, setTimeColor] = useState('text-black')
  const breakpoint = useBreakpoint()
  const timerSize = breakpoint === Breakpoint.SMALL ? 'text-6xl' : 'text-8xl'

  useEffect(() => {
    const timeStarted = new Date()

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor(
        (new Date().getTime() - timeStarted.getTime()) / 1000
      )
      const totalRemainingSeconds = Math.max(0, TIME_LIMIT - elapsedSeconds)
      const minutesRemaining = Math.floor(totalRemainingSeconds / 60)
      const secondsRemaining = totalRemainingSeconds % 60

      setMinutes(minutesRemaining)
      setSeconds(secondsRemaining)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const secondsRemaining = minutes * 60 + seconds
    if (secondsRemaining <= 0) {
      onTimeExpired()
    } else if (secondsRemaining <= TIME_WARNING) {
      setTimeColor('text-red-600')
    } else {
      setTimeColor('text-black')
    }
  }, [minutes, seconds, onTimeExpired])

  return (
    <div
      className={`${timerSize} font-bold font-mono ${timeColor} border-black border-solid border-2 rounded-lg py-2 px-4`}
    >
      {`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
    </div>
  )
}

export default QuizTimer
