import { gql } from '@apollo/client'

export default gql`
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
