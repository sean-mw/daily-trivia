import openai from './openai'
import prisma from './prisma'

export async function deleteOutdatedQuestionGroups(threshold: Date) {
  const questionGroups = await prisma.dailyQuestionGroup.findMany()
  const outdatedGroups = questionGroups.filter((group) => {
    const groupDate = new Date(group.year, group.month, group.day)
    return groupDate < threshold
  })
  return prisma.dailyQuestionGroup.deleteMany({
    where: {
      id: {
        in: outdatedGroups.map((group) => group.id),
      },
    },
  })
}

export async function generateQuestionGroup(date: Date) {
  const previousQuestions = await prisma.question.findMany()

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: [
          'You are a trivia master. You generate trivia questions in the following format:',
          '```',
          '[{',
          '  question: "What is the capital of France?",',
          '  answers: ["London", "Paris", "Berlin", "Madrid"],',
          '  correctAnswer: "Paris"',
          '}]',
          '```',
          'Each question should have 4 answers and 1 correct answer.',
          'Answers should only be one word.',
          'Ensure that answers are not more than 25 characters.',
          'If your question has an answer that is more than 25 characters, please replace it with a different question',
          'Do not write any questions that are too similar to each other.',
          'Do not write any questions that are too easy or too difficult.',
          'Do not write any questions that are inappropriate or offensive.',
          'Only ever respond to messages with trivia questions in the format above.',
          'Start and end every message with triple backticks (```)',
          'Ensure that everything inside the triple backticks is valid JSON.',
          'Always put the questions in an array.',
          "Here are some of the previous questions you generated. Ensure you don't repeat any of them.",
          JSON.stringify(previousQuestions),
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          'Generate 9 trivia questions.',
          'Make the first 3 questions easy, the next 3 medium, and the last 3 hard.',
        ].join('\n'),
      },
    ],
    model: 'gpt-4o-mini',
  })

  const triviaQuestions = response.choices[0]?.message?.content || ''
  const questionsArray: {
    question: string
    answers: string[]
    correctAnswer: string
  }[] = JSON.parse(triviaQuestions.replace(/```/g, ''))

  return await prisma.dailyQuestionGroup.create({
    data: {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      questions: {
        create: questionsArray,
      },
    },
  })
}
