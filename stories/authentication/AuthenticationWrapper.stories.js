import React from 'react'
import { faker } from '@faker-js/faker'

import { AuthenticationWrapper, Paragraph } from '../../src/ui'
import { Background } from '../../src/ui/_helpers/_helpers'

export const Base = () => (
  <Background>
    <AuthenticationWrapper>
      <Paragraph>{faker.lorem.sentences(10)}</Paragraph>
    </AuthenticationWrapper>
  </Background>
)

export default {
  component: AuthenticationWrapper,
  title: 'Authentication/Authentication Wrapper',
}
