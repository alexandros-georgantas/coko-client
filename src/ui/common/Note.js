import React from 'react'
import styled from 'styled-components'

import { grid, th } from '../../toolkit'

const Wrapper = styled.div`
  background: ${th('colorSecondary')};
  border-radius: 3px;
  font-size: ${th('fontSizeBaseSmall')};
  padding: ${grid(2)};
  text-align: justify;
`

const Note = props => {
  const { className, children } = props
  return <Wrapper className={className}>{children}</Wrapper>
}

Note.propTypes = {}

Note.defaultProps = {}

export default Note
