import React from 'react'
import { faker } from '@faker-js/faker'

import { ChatMessage } from '../../src/ui'

const date = new Date().toISOString()

export const Base = args => (
  <ChatMessage
    {...args}
    content={faker.lorem.sentences(2)}
    date={date}
    user={faker.person.fullName()}
  />
)

export const Own = () => (
  <ChatMessage content={faker.lorem.sentences(2)} date={date} own />
)

export const Short = () => (
  <ChatMessage
    content={faker.lorem.words(1)}
    date={date}
    user={faker.person.fullName()}
  />
)

export const ShortOwn = () => (
  <ChatMessage content={faker.lorem.words(1)} date={date} own />
)

export default {
  component: ChatMessage,
  title: 'Chat/Chat Message',
}
