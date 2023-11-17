import { React, useState } from 'react'

import { ProviderConnection } from '../../src/ui'

export const Base = args => <ProviderConnection {...args} />

Base.args = {
  closeOnSuccess: false,
  connecting: true,
  redirectUrlLabel: 'FAKE PAGE',
  successfullyConnected: false,
}

export const SuccessWithClose = args => (
  <ProviderConnection closeOnSuccess successfullyConnected />
)

export const SuccessWithRedirect = args => (
  <ProviderConnection redirectUrlLabel="FAKE PAGE" successfullyConnected />
)

export const Error = args => <ProviderConnection />

export const SuccessFlow = args => {
  const [connecting, setConnecting] = useState(true)
  const [successfullyConnected, setSuccessfullyConnected] = useState(false)

  setTimeout(() => {
    setSuccessfullyConnected(true)
    setConnecting(false)
  }, 3000)

  return (
    <ProviderConnection
      closeOnSuccess
      connecting={connecting}
      successfullyConnected={successfullyConnected}
    />
  )
}

export const ErrorFlow = args => {
  const [connecting, setConnecting] = useState(true)

  setTimeout(() => {
    setConnecting(false)
  }, 3000)

  return (
    <ProviderConnection
      closeOnSuccess
      connecting={connecting}
      successfullyConnected={false}
    />
  )
}

export default {
  component: ProviderConnection,
  title: 'Authentication/ProviderConnection',
}
