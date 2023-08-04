import React from 'react'
import { faker } from '@faker-js/faker'

import { ChatThread } from '../../src/ui'
import { createData, noop, randomPick } from '../../src/ui/_helpers/_helpers'

const createMessages = n =>
  createData(n, i => ({
    content: faker.lorem.sentences(2),
    date: new Date().toISOString(),
    own: randomPick([true, false]),
    user: faker.person.fullName(),
  }))

const messages = createMessages(5)

export const Base = () => <ChatThread messages={messages} onSend={noop} />
export const Empty = () => <ChatThread onSend={noop} />

export default {
  component: ChatThread,
  title: 'Chat/Chat Thread',
}
