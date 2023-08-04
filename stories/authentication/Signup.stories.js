/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react'
import { faker } from '@faker-js/faker'

import { Signup } from '../../src/ui'
import { Background } from '../../src/ui/_helpers/_helpers'

export const Base = args => (
  <Background>
    <Signup {...args} />
  </Background>
)

Base.args = {
  onSubmit: () => {},
  errorMessage: faker.lorem.sentence(),
  userEmail: faker.internet.email(),
}

export const FailingSignup = () => {
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setHasError(false)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setHasError(true)
    }, 2000)
  }

  return (
    <Background>
      <Signup
        errorMessage="A user with this email already exists!"
        hasError={hasError}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Background>
  )
}

export const SuccessfulSignup = () => {
  const [hasSuccess, setHasSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setHasSuccess(false)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setHasSuccess(true)
    }, 2000)
  }

  return (
    <Background>
      <Signup
        hasSuccess={hasSuccess}
        loading={loading}
        onSubmit={handleSubmit}
        userEmail={faker.internet.email()}
      />
    </Background>
  )
}

export const SuccessScreen = () => {
  return (
    <Background>
      <Signup
        hasSuccess
        onSubmit={() => {}}
        userEmail={faker.internet.email()}
      />
    </Background>
  )
}

export default {
  component: Signup,
  title: 'Authentication/Signup',
  parameters: { actions: { argTypesRegex: '^on.*' } },
}
