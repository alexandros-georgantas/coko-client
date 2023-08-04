import React from 'react'
import { faker } from '@faker-js/faker'
import { Paragraph, Text } from '../../src/ui'

export const Base = () => <Paragraph>{faker.lorem.sentences(10)}</Paragraph>

export const ParagraphDemo = () => (
  <Paragraph>{faker.lorem.sentences(10)}</Paragraph>
)

export const TextDemo = () => <Text>{faker.lorem.sentence()}</Text>
export const StrongText = () => <Text strong>{faker.lorem.sentence()}</Text>

export default {
  title: 'Common/Typography',
}
