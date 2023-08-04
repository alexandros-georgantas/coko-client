import React from 'react'
import { faker } from '@faker-js/faker'
import { Ribbon } from '../../src/ui'

export const Base = () => <Ribbon>{faker.lorem.words(4)}</Ribbon>
export const Success = () => (
  <Ribbon status="success">{faker.lorem.words(4)}</Ribbon>
)

export const Error = () => (
  <Ribbon status="error">{faker.lorem.words(4)}</Ribbon>
)

export default {
  component: Ribbon,
  title: 'Common/Ribbon',
}
