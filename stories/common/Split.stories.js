import React from 'react'
import styled, { css } from 'styled-components'
// import { lorem } from '@faker-js/faker'

import { Split } from '../../src/ui'

const Wrapper = styled.div`
  height: 400px;

  > div {
    height: 100%;
  }
`

const boxes = css`
  align-items: center;
  color: white;
  display: flex;
  font-weight: bold;
  height: 100%;
  justify-content: center;
  text-transform: uppercase;
  width: 100%;
`

const Left = styled.div`
  background-color: cornflowerblue;
  ${boxes};
`

const Right = styled.div`
  background-color: salmon;
  ${boxes};
`

export const Base = () => (
  <Wrapper>
    <Split>
      <Left>left</Left>
      <Right>right</Right>
    </Split>
  </Wrapper>
)

export const TwoThirds = () => (
  <Wrapper>
    <Split splitAt={16}>
      <Left>left</Left>
      <Right>right</Right>
    </Split>
  </Wrapper>
)

export const WithGutter = () => (
  <Wrapper>
    <Split gutter={8} splitAt={16}>
      <Left>left</Left>
      <Right>right</Right>
    </Split>
  </Wrapper>
)

export default {
  component: Split,
  title: 'Common/Split',
}
