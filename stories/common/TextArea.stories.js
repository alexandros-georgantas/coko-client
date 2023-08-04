import React from 'react'
import { faker } from '@faker-js/faker'

import { TextArea } from '../../src/ui'

export const Base = () => (
  <TextArea placeholder={faker.lorem.words(4)} rows={3} />
)

export const AutoSize = () => (
  <TextArea autoSize placeholder={faker.lorem.words(4)} />
)

export default {
  component: TextArea,
  title: 'Common/TextArea',
}
