import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  {
    question: 'What is the color of the sky on a clear day?',
    answers: ['Blue', 'Green', 'Red', 'Yellow'],
    correctAnswer: 'Blue',
  },
  {
    question: 'How many days are there in a week?',
    answers: ['5', '6', '7', '8'],
    correctAnswer: '7',
  },
  {
    question: 'Which animal is known as "Man\'s best friend"?',
    answers: ['Cat', 'Dog', 'Bird', 'Fish'],
    correctAnswer: 'Dog',
  },
  {
    question: 'What is the chemical symbol for water?',
    answers: ['H2O', 'O2', 'CO2', 'HO'],
    correctAnswer: 'H2O',
  },
  {
    question: 'Who wrote the play "Romeo and Juliet"?',
    answers: [
      'William Shakespeare',
      'Mark Twain',
      'Charles Dickens',
      'Jane Austen',
    ],
    correctAnswer: 'William Shakespeare',
  },
  {
    question: 'What is the capital of Japan?',
    answers: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
    correctAnswer: 'Tokyo',
  },
  {
    question: 'What is the smallest prime number?',
    answers: ['1', '2', '3', '5'],
    correctAnswer: '2',
  },
  {
    question: 'Who developed the theory of relativity?',
    answers: [
      'Isaac Newton',
      'Albert Einstein',
      'Galileo Galilei',
      'Nikola Tesla',
    ],
    correctAnswer: 'Albert Einstein',
  },
  {
    question: 'Which planet is known as the "Morning Star" or "Evening Star"?',
    answers: ['Mars', 'Venus', 'Mercury', 'Saturn'],
    correctAnswer: 'Venus',
  },
]

async function main() {
  const now = new Date()
  const month = now.getMonth()
  const day = now.getDate()

  await prisma.dailyQuestionGroup.create({
    data: {
      month,
      day,
      questions: {
        create: questions.map((question) => ({
          question: question.question,
          answers: question.answers,
          correctAnswer: question.correctAnswer,
        })),
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
