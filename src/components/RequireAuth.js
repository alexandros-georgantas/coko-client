import React, { useEffect } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useApolloClient, gql } from '@apollo/client'

import { useCurrentUser } from '../helpers/currentUserContext'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      username
      # roles
    }
  }
`

const RequireAuth = props => {
  const {
    notAuthenticatedRedirectTo,
    LoadingComponent,
    cleanUp,
    children,
  } = props

  const client = useApolloClient()
  const location = useLocation()
  const { currentUser, setCurrentUser } = useCurrentUser()
  const token = localStorage.getItem('token')

  const { data, loading, error } = useQuery(CURRENT_USER, {
    skip: !token || currentUser,
  })

  // update context when data arrives
  useEffect(() => {
    if (data && data.currentUser) {
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

  return children
}

RequireAuth.propTypes = {
  cleanUp: PropTypes.func,
}

RequireAuth.defaultProps = {
  LoadingComponent: 'Loading...',
  cleanUp: () => {},
}

export default RequireAuth
