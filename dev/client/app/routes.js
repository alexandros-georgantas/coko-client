import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PageLayout, RequireAuth } from '../../../src'

import { NavigationBar, Root, ImageDemo, AntDemo, Protected } from './pages'

const routes = (
  <PageLayout fadeInPages navComponent={NavigationBar} padPages>
    <Switch>
      <Route component={Root} exact path="/" />
      <Route component={ImageDemo} exact path="/imagedemo" />
      <Route component={AntDemo} exact path="/ant" />

      <Route
        exact
        path="/protected"
        render={() => (
          <RequireAuth
            notAuthenticatedRedirectTo="/"
            requireIdentityVerification={false}
          >
            <Protected />
          </RequireAuth>
        )}
      />
    </Switch>
  </PageLayout>
)

export default routes
