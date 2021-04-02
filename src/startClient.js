import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

import { Root } from '@pubsweet/client'

const history = createBrowserHistory()
const rootEl = document.getElementById('root')

const startClient = (routes, theme, options = {}) => {
  const connectToWebSocket = options.connectToWebSocket || false

  ReactDOM.render(
    <Root
      connectToWebSocket={connectToWebSocket}
      history={history}
      routes={routes}
      theme={theme}
    />,
    rootEl,
  )
}

export default startClient
