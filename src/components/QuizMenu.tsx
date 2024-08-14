import useBreakpoint, { Breakpoint } from '@/app/hooks/useBreakpoint'
import Button from './Button'

type QuizMenuProps = {
  onStart: () => void
}

const QuizMenu: React.FC<QuizMenuProps> = ({ onStart }) => {
  const breakpoint = useBreakpoint()
  const titleSize = breakpoint === Breakpoint.SMALL ? 'text-6xl' : 'text-8xl'

  return (
    <div className="flex flex-col h-[calc(100dvh)] px-5 py-10 gap-10 items-center justify-center">
      <div className={`${titleSize} font-bold`}>Daily Trivia</div>
      <Button onClick={onStart}>START</Button>
    </div>
  )
}

export default QuizMenu
