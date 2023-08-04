import React from 'react'
import { faker } from '@faker-js/faker'

import { AuthenticationHeader } from '../../src/ui'

export const Base = () => (
  <AuthenticationHeader>{faker.lorem.words(3)}</AuthenticationHeader>
)

export default {
  component: AuthenticationHeader,
  title: 'Authentication/Authentication Header',
}
