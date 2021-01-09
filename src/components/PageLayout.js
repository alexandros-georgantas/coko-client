import styled, { createGlobalStyle } from 'styled-components'
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { fadeIn, grid, th } from '@pubsweet/ui-toolkit'

// TO DO -- Remove div > div when you clean up client from pubsweet
const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }

  body {
    height: 100vh;
    overflow: hidden;
  }

  #root,
  #root > div,
  #root > div > div {
    height: 100%;
  }
`

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Page = styled.div`
  flex: auto;
  font-family: ${th('fontInterface')};
  height: 100%;
  overflow-y: auto;
  padding: ${grid(2)} ${grid(2)} 50px ${grid(2)};

  /* stylelint-disable-next-line no-descending-specificity */
  > div {
    animation: ${fadeIn} 0.5s;
  }
`

// TO DO -- move global style to root when you export that from this client
const Layout = ({ children, navComponent }) => (
  <>
    <GlobalStyle />
    <PageLayout>
      <Route component={navComponent} />
      <Page>{children}</Page>
    </PageLayout>
  </>
)

Layout.propTypes = {
  navComponent: PropTypes.elementType.isRequired,
}

export default Layout
