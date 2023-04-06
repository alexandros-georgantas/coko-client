import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { useCurrentUser } from '../helpers/currentUserContext'
import CURRENT_USER from '../helpers/currentUserQuery'

const AuthWrapper = props => {
  const {
    loadingComponent: LoadingComponent,
    currentUserQuery,
    children,
  } = props

  const { currentUser, setCurrentUser } = useCurrentUser()

  const { data, loading, error } = useQuery(currentUserQuery, {
    skip: currentUser,
  })

  // update context when data arrives
  useEffect(() => {
    if (data && data.currentUser) {
      setCurrentUser(data.currentUser)
    }
  }, [data])

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
