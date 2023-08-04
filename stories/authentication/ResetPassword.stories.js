/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
// import { faker } from '@faker-js/faker'

import { ResetPassword } from '../../src/ui'
import { Background } from '../../src/ui/_helpers/_helpers'

const Template = args => (
  <Background>
    <ResetPassword {...args} />
  </Background>
)

export const Base = Template.bind({})
Base.args = {
  onSubmit: () => {},
}

export default {
  component: ResetPassword,
  title: 'Authentication/Reset Password',
}
