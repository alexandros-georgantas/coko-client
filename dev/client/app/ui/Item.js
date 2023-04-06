/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'

const StyledItem = styled.div`
  border: 1px solid ${props => props.theme.colorBorder};
  border-radius: 5px;
  color: ${props => props.theme.colorText};
  margin: 5px 25px;
  padding: 10px;
`

const Item = props => {
  const { text } = props

  return <StyledItem>{text}</StyledItem>
}

export default Item
