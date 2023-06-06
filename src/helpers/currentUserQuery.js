import { gql } from '@apollo/client'

export default gql`
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
