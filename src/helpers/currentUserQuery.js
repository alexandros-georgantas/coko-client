import { gql } from '@apollo/client'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      username
      teams {
        id
        role
        objectId
        global
        members(currentUserOnly: true) {
          id
          user {
            id
          }
          status
        }
      }
      isActive
      defaultIdentity {
        id
        isVerified
      }
      identities {
        id
        provider
        hasValidRefreshToken
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
        members(currentUserOnly: true) {
          id
          user {
            id
          }
          status
        }
      }
      isActive
      defaultIdentity {
        id
        isVerified
      }
      identities {
        id
        provider
        hasValidRefreshToken
      }
    }
  }
`

export { CURRENT_USER, USER_UPDATED_SUBSCRIPTION }
