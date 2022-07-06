import React from 'react'
import ReactDOM from 'react-dom'
import { createBrowserHistory } from 'history'

// ADD THIS IF WE STANDARDIZE ANTD ACROSS THE APPS AND ANTD IS A CLIENT DEPENDENCY
// import 'antd/dist/antd.less'

// import { Root } from '@pubsweet/client'

import Root from './Root'

const history = createBrowserHistory()
const rootEl = document.getElementById('root')

const startClient = (routes, theme, options = {}) => {
  const connectToWebSocket = options.connectToWebSocket || false
  const { makeApolloConfig } = options

  ReactDOM.render(
    <Root
      connectToWebSocket={connectToWebSocket}
      history={history}
      makeApolloConfig={makeApolloConfig}
      routes={routes}
      theme={theme}
    />,
    rootEl,
  )
}

export default startClient
