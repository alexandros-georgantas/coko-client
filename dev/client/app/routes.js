import React from 'react'
import { Route, Switch } from 'react-router-dom'

import { PageLayout, RequireAuth, Authenticate } from '../../../src'

import { ProviderConnectionPage } from '../../../src/pages'

import {
  NavigationBar,
  Root,
  ImageDemo,
  AntDemo,
  Protected,
  Teams,
} from './pages'

const Routes = (
  <Authenticate>
    <PageLayout fadeInPages navComponent={NavigationBar} padPages>
      <Switch>
        <Route component={Root} exact path="/" />
        <Route component={ImageDemo} exact path="/imagedemo" />
        <Route component={AntDemo} exact path="/ant" />
        <Route component={Teams} exact path="/teams" />

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

        <Route exact path="/provider-connection-popup/:provider">
          <ProviderConnectionPage closeOnSuccess />
        </Route>
      </Switch>
    </PageLayout>
  </Authenticate>
)

export default Routes
