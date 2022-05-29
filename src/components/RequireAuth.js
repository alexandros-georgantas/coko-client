import React, { useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useApolloClient, gql } from '@apollo/client'
import get from 'lodash/get'

import { useCurrentUser } from '../helpers/currentUserContext'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      username
      # roles

      defaultIdentity {
        id
        isVerified
      }
    }
  }
`

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
    loadingComponent: LoadingComponent,
    cleanUp,
    children,
    requireIdentityVerification,
    notVerifiedRedirectTo,
    currentUserQuery,
  } = props

  const client = useApolloClient()
  const location = useLocation()
  const { currentUser, setCurrentUser } = useCurrentUser()
  const token = localStorage.getItem('token')

  const { data, loading, error } = useQuery(currentUserQuery, {
    skip: !token || currentUser,
  })

  // update context when data arrives
  useEffect(() => {
    if (data && data.currentUser) {
      const requiredFieldsExist = checkForRequiredFields(data.currentUser)

      if (!requiredFieldsExist) {
        throw new Error(
          `Your current user query is missing some required fields! Make sure that the query requests the following fields: ${requiredFields.join(
            ', ',
          )}`,
        )
      }

      setCurrentUser(data.currentUser)
    }
  }, [data])

  if (error) console.error(error)

  if (!token || error) {
    client.cache.reset()
    localStorage.removeItem('token')
    cleanUp()

    const redirectUrl = `${notAuthenticatedRedirectTo}?next=${location.pathname}`
    return <Redirect to={redirectUrl} />
  }

  if (loading) {
    return LoadingComponent
  }

  // render where setCurrentUser has been triggered but the context has not been updated yet
  if (!currentUser) {
    return null
  }

  if (requireIdentityVerification) {
    const verified = currentUser?.defaultIdentity?.isVerified
    if (!verified) return <Redirect to={notVerifiedRedirectTo} />
  }

  return children
}

RequireAuth.propTypes = {
  cleanUp: PropTypes.func,
  currentUserQuery: PropTypes.string,
  requireIdentityVerification: PropTypes.bool,
  notVerifiedRedirectTo: PropTypes.string,
}

RequireAuth.defaultProps = {
  loadingComponent: 'Loading...',
  cleanUp: () => {},
  currentUser: CURRENT_USER,
  requireIdentityVerification: true,
  notVerifiedRedirectTo: '/ensure-verified-login',
}

export default RequireAuth
