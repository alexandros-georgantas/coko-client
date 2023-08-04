import React, { useState } from 'react'
import styled, { css } from 'styled-components'
// import { lorem } from '@faker-js/faker'

import { Layout, Paragraph, Switch } from '../../src/ui'

const Wrapper = styled.div`
  ${props =>
    props.showBorder &&
    css`
      border: 2px solid coral;
    `}
`

export const Base = () => {
  const [showBorder, setShowBorder] = useState(true)

  return (
    <>
      <Paragraph>
        Colored border for demo purposes only
        <Switch
          checked={showBorder}
          onChange={() => setShowBorder(!showBorder)}
        />
      </Paragraph>

      <Wrapper showBorder={showBorder}>
        <Layout>
          <Layout.Header>Header</Layout.Header>
          <Layout.Content>Content</Layout.Content>
          <Layout.Footer>Footer</Layout.Footer>
        </Layout>
      </Wrapper>
    </>
  )
}

export default {
  component: Layout,
  title: 'Common/Layout',
}
