import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid, th } from '../../toolkit'

const Wrapper = styled.span`
  border: 1px dashed ${th('colorPrimary')};
  font-size: ${th('fontSizeBaseSmall')};
  padding: ${grid(1)};
`

const Label = styled.span`
  color: ${th('colorPrimary')};
  text-transform: uppercase;
`

const SuggestedReviewer = props => {
  const { className, name } = props

  return (
    <Wrapper className={className}>
      <Label>Author Suggested Reviewer:</Label> {name}
    </Wrapper>
  )
}

SuggestedReviewer.propTypes = {
  /** Display name of suggested reviewer */
  name: PropTypes.string.isRequired,
}

SuggestedReviewer.defaultProps = {}

export default SuggestedReviewer
