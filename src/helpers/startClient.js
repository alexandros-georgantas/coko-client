import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

import { Root } from '@pubsweet/client'

// eslint-disable-next-line import/no-unresolved
import theme from 'theme'

// ADD THIS IF WE STANDARDIZE ANTD ACROSS THE APPS AND ANTD IS A CLIENT DEPENDENCY
// import 'antd/dist/antd.less'

const history = createBrowserHistory()
const rootEl = document.getElementById('root')

const startClient = (routes, options = {}) => {
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
