import OpenAI from 'openai'

const openaiSingleton = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

declare const globalThis: {
  openaiGlobal: ReturnType<typeof openaiSingleton>
} & typeof global

const openai = globalThis.openaiGlobal ?? openaiSingleton()

export default openai

if (process.env.NODE_ENV !== 'production') globalThis.openaiGlobal = openai
