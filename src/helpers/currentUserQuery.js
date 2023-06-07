import { gql } from '@apollo/client'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      username
      # roles
      teams {
        id
        role
        objectId
        global
      }
      isActive
      defaultIdentity {
        id
        isVerified
      }
    }
  }
`

const USER_UPDATED_SUBSCRIPTION = gql`
  subscription OnUserUpdated($userId: ID!) {
    userUpdated(userId: $userId) {
      id
      displayName
      username
      # roles
      teams {
        id
        role
        objectId
        global
      }
      isActive
      defaultIdentity {
        id
        isVerified
      }
    }
  }
`

export { CURRENT_USER, USER_UPDATED_SUBSCRIPTION }
