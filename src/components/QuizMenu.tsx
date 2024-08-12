import Button from './Button'

type QuizMenuProps = {
  onStart: () => void
}

const QuizMenu: React.FC<QuizMenuProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col p-20 gap-10 items-center">
      <div className="text-3xl font-bold">Daily Trivia</div>
      <Button onClick={onStart}>START</Button>
    </div>
  )
}

export default QuizMenu
