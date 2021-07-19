/**
 * This file (and folder) are only meant to provide a playground for our
 * client. They will not be provided in the package distribution build.
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { startClient, PageLayout } from '../../src'

import theme from './theme'

import { First, Second, AntPage, NavigationBar } from './components'

// Make sure async functions are supported
/* eslint-disable no-unused-vars */
const doSomethingAsync = async () => {
  await console.error('do it')
}

const routes = (
  <PageLayout fadeInPages navComponent={NavigationBar} padPages>
    <Switch>
      <Route component={First} exact path="/" />
      <Route component={Second} exact path="/second" />
      <Route component={AntPage} exact path="/ant" />
    </Switch>
  </PageLayout>
)

startClient(routes, theme)
