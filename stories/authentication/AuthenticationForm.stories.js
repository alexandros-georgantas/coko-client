/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import { faker } from '@faker-js/faker'

import { AuthenticationForm } from '../../src/ui'
import { Filler } from '../../src/ui/_helpers/_helpers'

const Template = args => {
  return (
    <AuthenticationForm {...args}>
      <Filler />
    </AuthenticationForm>
  )
}

const commonArgs = {
  alternativeActionLabel: 'Do you want to do something else?',
  alternativeActionLink: '/',
  onSubmit: () => {},
  errorMessage: faker.lorem.sentence(),
  hasError: false,
}

export const Base = Template.bind({})

Base.args = {
  ...commonArgs,
}

export const Loading = Template.bind({})

Loading.args = {
  ...commonArgs,
  loading: true,
}

export default {
  component: AuthenticationForm,
  title: 'Authentication/Authentication Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
}
