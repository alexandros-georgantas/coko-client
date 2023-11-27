import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { CREATE_OAUTH_IDENTITY } from './ProviderConnection.queries'
// import { useCurrentUser } from '../helpers/currentUserContext'
import ProviderConnection from '../ui/authentication/ProviderConnection'

const ProviderConnectionPage = props => {
  const {
    closeOnSuccess,
    delayOnSuccess,
    loadingMinimumTime,
    redirectOnSuccess,
    redirectUrlLabel,
  } = props

  const { provider } = useParams()
  const history = useHistory()
  // const { currentUser } = useCurrentUser()
  const [successfullyConnected, setSuccessfullyConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  // Get query string arguments
  const {
    session_state: sessionState,
    code,
    next,
  } = Object.fromEntries(new URL(window.location).searchParams)

  const [createOAuthIdentity, { called: createOAuthIdentityCalled }] =
    useMutation(CREATE_OAUTH_IDENTITY, {
      variables: {
        provider,
        sessionState,
        code,
      },
      onCompleted: () => {
        setTimeout(() => {
          setLoading(false)
          setSuccessfullyConnected(true)

          setTimeout(() => {
            if (closeOnSuccess) window.close()

            if (!closeOnSuccess && redirectOnSuccess && next) {
              history.push(next)
            }
          }, delayOnSuccess)
        }, loadingMinimumTime)
      },
      onError: err => {
        if (err) console.error(err)

        setLoading(false)
        setSuccessfullyConnected(false)
      },
    })

  // if (currentUser && !createOAuthIdentityCalled) {
  if (!createOAuthIdentityCalled) {
    createOAuthIdentity()
  }

  return (
    <ProviderConnection
      closeOnSuccess={closeOnSuccess}
      connecting={loading}
      redirectUrlLabel={redirectUrlLabel}
      successfullyConnected={successfullyConnected}
    />
  )
}

ProviderConnectionPage.propTypes = {
  closeOnSuccess: PropTypes.bool,
  delayOnSuccess: PropTypes.number,
  loadingMinimumTime: PropTypes.bool,
  redirectOnSuccess: PropTypes.bool,
  redirectUrlLabel: PropTypes.string,
}

ProviderConnectionPage.defaultProps = {
  closeOnSuccess: false,
  delayOnSuccess: 1000,
  loadingMinimumTime: 1000,
  redirectOnSuccess: false,
  redirectUrlLabel: null,
}

export default ProviderConnectionPage
