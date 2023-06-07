import PropTypes from 'prop-types'
import { useQuery, useSubscription } from '@apollo/client'
import { useCurrentUser } from '../helpers/currentUserContext'
import {
  CURRENT_USER,
  USER_UPDATED_SUBSCRIPTION,
} from '../helpers/currentUserQuery'

const AuthWrapper = props => {
  const {
    loadingComponent: LoadingComponent,
    currentUserQuery,
    children,
  } = props

  const { currentUser, setCurrentUser } = useCurrentUser()

  const { loading, error } = useQuery(currentUserQuery, {
    skip: currentUser,
    onCompleted: ({ currentUser: fetchedUser }) => setCurrentUser(fetchedUser),
  })

  useSubscription(USER_UPDATED_SUBSCRIPTION, {
    skip: !currentUser,
    variables: { userId: currentUser?.id },
    onData: ({ userUpdated }) => {
      setCurrentUser(userUpdated)
    },
  })

  if (error) console.error(error)

  if (loading) {
    return LoadingComponent
  }

  return children
}

AuthWrapper.propTypes = {
  loadingComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  currentUserQuery: PropTypes.shape(),
}

AuthWrapper.defaultProps = {
  loadingComponent: 'Loading...',
  currentUserQuery: CURRENT_USER,
}

export default AuthWrapper
