/**
 * This file (and folder) are only meant to provide a playground for our
 * client. They will not be provided in the package distribution build.
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import 'fontsource-advent-pro'

import { startClient, PageLayout } from '../src'

import { First, Second, NavigationBar } from './components'

const theme = {
  colorBackground: 'lavender',
  colorBorder: 'lightslategray',
  colorCurrency: 'navy',
  colorRate: 'crimson',
  fontInterface: 'Advent Pro',
  gridUnit: '8px',
}

const routes = (
  <PageLayout fadeInPages navComponent={NavigationBar} padPages>
    <Switch>
      <Route component={First} exact path="/" />
      <Route component={Second} exact path="/second" />
    </Switch>
  </PageLayout>
)

startClient(routes, theme)
