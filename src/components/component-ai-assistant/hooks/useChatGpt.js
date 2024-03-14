import { useState } from 'react'

export default function useChatGpt({ onCompleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const chatGPT = async ({ input, history = [] }) => {
    setLoading(true)
    setError(null)

    try {
      const CHAT_GPT_URL = 'https://api.openai.com/v1/chat/completions'

      const CHAT_GPT_KEY = process.env.CHAT_GPT_KEY || ''

      if (!CHAT_GPT_KEY) {
        throw new Error('Missing access key')
      }

      const response = await fetch(CHAT_GPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHAT_GPT_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            ...history,
            {
              role: 'user',
              content: input,
            },
          ],
          temperature: 0,
        }),
      })

      const responseData = await response.json()

      onCompleted(responseData.choices[0].message.content)
      setData(responseData)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { chatGPT, loading, error, data }
}
