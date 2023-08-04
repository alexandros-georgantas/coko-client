/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react'
// import { faker } from '@faker-js/faker'

import { Login } from '../../src/ui'
import { Background } from '../../src/ui/_helpers/_helpers'

export const Base = args => (
  <Background>
    <Login {...args} />
  </Background>
)

export const FailingLogin = () => {
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
      <Login
        errorMessage="This is not a valid user / password combination"
        hasError={hasError}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Background>
  )
}

export default {
  component: Login,
  title: 'Authentication/Login',
  parameters: { actions: { argTypesRegex: '^on.*' } },
}
