import React from 'react'
import { faker } from '@faker-js/faker'

import { ChatMessageList } from '../../src/ui'
import { createData, randomPick } from '../../src/ui/_helpers/_helpers'

const createMessages = n =>
  createData(n, i => ({
    content: faker.lorem.sentences(2),
    date: new Date().toISOString(),
    own: randomPick([true, false]),
    user: faker.person.fullName(),
  }))

const messages = createMessages(10)

export const Base = () => <ChatMessageList messages={messages} />

export const Empty = () => <ChatMessageList />

export default {
  component: ChatMessageList,
  title: 'Chat/Chat Message List',
}
