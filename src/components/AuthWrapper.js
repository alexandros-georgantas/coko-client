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

  const { loading, error } = useQuery(currentUserQuery, {
    skip: currentUser,
    onCompleted: ({ currentUser: fetchedUser }) => {
      setCurrentUser(fetchedUser)
    },
  })

  useSubscription(USER_UPDATED_SUBSCRIPTION, {
    skip: !currentUser,
    variables: { userId: currentUser?.id },
    onData: ({ userUpdated, client }) => {
      setCurrentUser(userUpdated)
    },
  })

  if (error) console.error(error)

  return <LoadingComponent spinning={loading}>{children}</LoadingComponent>
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
