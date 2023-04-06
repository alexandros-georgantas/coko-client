import React, { useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useApolloClient } from '@apollo/client'
import get from 'lodash/get'

import { useCurrentUser } from '../helpers/currentUserContext'

const requiredFields = [
  'id',
  'displayName',
  'username',
  'defaultIdentity.id',
  'defaultIdentity.isVerified',
]

const checkForRequiredFields = user => {
  const fieldsMissing = requiredFields.some(k => {
    return typeof get(user, k) === 'undefined'
  })

  return !fieldsMissing
}

const RequireAuth = props => {
  const {
    notAuthenticatedRedirectTo,
    cleanUp,
    children,
    requireIdentityVerification,
    notVerifiedRedirectTo,
  } = props

  const client = useApolloClient()
  const location = useLocation()
  const { currentUser } = useCurrentUser()

  useEffect(() => {
    if (currentUser) {
      const requiredFieldsExist = checkForRequiredFields(currentUser)

      if (!requiredFieldsExist) {
        throw new Error(
          `Your current user query is missing some required fields! Make sure that the query requests the following fields: ${requiredFields.join(
            ', ',
          )}`,
        )
      }
    }
  }, [currentUser])

  if (!localStorage.getItem('token')) {
    client.cache.reset()
    cleanUp()

    const redirectUrl = `${notAuthenticatedRedirectTo}?next=${location.pathname}`
    return <Redirect to={redirectUrl} />
  }

  if (requireIdentityVerification) {
    const verified = currentUser?.defaultIdentity?.isVerified
    if (!verified) return <Redirect to={notVerifiedRedirectTo} />
  }

  return children
}

RequireAuth.propTypes = {
  cleanUp: PropTypes.func,
  requireIdentityVerification: PropTypes.bool,
  notVerifiedRedirectTo: PropTypes.string,
  notAuthenticatedRedirectTo: PropTypes.string,
}

RequireAuth.defaultProps = {
  cleanUp: () => {},
  requireIdentityVerification: true,
  notVerifiedRedirectTo: '/ensure-verified-login',
  notAuthenticatedRedirectTo: '/login',
}

export default RequireAuth
