import React from 'react'

export const CurrentUserContext = React.createContext({})
export const useCurrentUser = () => React.useContext(CurrentUserContext)
