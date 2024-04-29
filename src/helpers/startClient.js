import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

import Root from './Root'

const history = createBrowserHistory()
const rootEl = document.getElementById('root')

const startClient = (routes, theme, options = {}) => {
  const { makeApolloConfig } = options

  ReactDOM.render(
    <Root
      history={history}
      makeApolloConfig={makeApolloConfig}
      routes={routes}
      theme={theme}
    />,
    rootEl,
  )
}

export default startClient
