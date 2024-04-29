import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { th } from '../../toolkit'

const StyledLink = styled(Link)`
  && {
    color: ${th('colorText')};
    text-decoration: underline;

    &:hover {
      color: ${th('colorText')};
      text-decoration: none;
    }

    &:focus {
      color: ${th('colorText')};
      outline: 1px solid ${th('colorPrimary')};
      text-decoration: none;
    }
  }
`

const CokoLink = props => {
  // const { href, ...restProps } = props
  // if (href) {
  //   return (
  //     <StyledLink {...restProps} />
  //   )
  // }
  return <StyledLink {...props} />
}

export default CokoLink
