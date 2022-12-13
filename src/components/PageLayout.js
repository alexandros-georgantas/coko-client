import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import styled, { createGlobalStyle, css } from 'styled-components'

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

  #root {
    height: 100%;
  }
`

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const fadeInPage = css`
  animation: ${fadeIn} 0.5s;
`

const padPage = css`
  padding: ${grid(2)} ${grid(2)} 50px ${grid(2)};
`

const Page = styled.main`
  flex: auto;
  font-family: ${th('fontInterface')};
  height: 100%;
  overflow-y: auto;

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props => props.padPages && padPage}

  /* stylelint-disable-next-line no-descending-specificity */
  > div {
    ${props => props.fadeInPages && fadeInPage}
  }
`

// TO DO -- move global style to root when you export that from this client
const Layout = ({
  children,
  className,
  fadeInPages,
  padPages,
  navComponent,
  mainId,
}) => (
  <>
    <GlobalStyle />
    <PageLayout className={className}>
      <Route component={navComponent} />
      <Page
        fadeInPages={fadeInPages}
        id={mainId}
        padPages={padPages}
        tabIndex="-1"
      >
        {children}
      </Page>
    </PageLayout>
  </>
)

Layout.propTypes = {
  fadeInPages: PropTypes.bool,
  padPages: PropTypes.bool,
  navComponent: PropTypes.elementType,
  mainId: PropTypes.string,
}

Layout.defaultProps = {
  fadeInPages: true,
  padPages: true,
  navComponent: null,
  mainId: 'main',
}

export default Layout
