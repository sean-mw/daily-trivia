import Quiz from '@/components/Quiz'

export default function Game() {
  const questions = [
    {
      question: 'What is the capital of France?',
      answers: ['Paris', 'Berlin', 'Madrid', 'Rome'],
      correctAnswer: 'Paris',
    },
    {
      question: 'What is 3 + 5?',
      answers: ['7', '8', '9', '10'],
      correctAnswer: '8',
    },
    {
      question: 'What is the largest planet in our solar system?',
      answers: ['Earth', 'Jupiter', 'Saturn', 'Mars'],
      correctAnswer: 'Jupiter',
    },
  ]

  return (
    <main>
      <Quiz questions={questions} />
    </main>
  )
}
