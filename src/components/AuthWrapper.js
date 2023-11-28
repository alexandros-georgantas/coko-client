import React from 'react'
import PropTypes from 'prop-types'
import { useQuery, useSubscription } from '@apollo/client'
import { useCurrentUser } from '../helpers/currentUserContext'
import {
  CURRENT_USER,
  USER_UPDATED_SUBSCRIPTION,
} from '../helpers/currentUserQuery'

import Spin from '../ui/common/Spin'

const AuthWrapper = props => {
  const {
    loadingComponent: LoadingComponent,
    currentUserQuery,
    children,
  } = props

  const { currentUser, setCurrentUser } = useCurrentUser()

  const { loading } = useQuery(currentUserQuery, {
    skip: currentUser,
    onCompleted: ({ currentUser: fetchedUser }) => {
      setCurrentUser(fetchedUser)
    },
    onError: error => {
      // Make sure 'currentUser' is defined and null so that RequireAuth knows
      // to clear the current (corrupted) token.
      // Note on session states:
      //  * undefined: current user remains unresolved
      //  * null: current user is resolved but unauthorised or token invalid
      setCurrentUser(null)
      console.error(error)
    },
  })

  useSubscription(USER_UPDATED_SUBSCRIPTION, {
    skip: !currentUser,
    variables: { userId: currentUser?.id },
    onData: ({ data }) => {
      const { userUpdated } = data.data
      setCurrentUser(userUpdated)
    },
  })

  return (
    <LoadingComponent spinning={loading && !currentUser}>
      {children}
    </LoadingComponent>
  )
}

AuthWrapper.propTypes = {
  loadingComponent: PropTypes.func,
  currentUserQuery: PropTypes.shape(),
}

AuthWrapper.defaultProps = {
  loadingComponent: Spin,
  currentUserQuery: CURRENT_USER,
}

export default AuthWrapper
