import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.div``

const Protected = props => {
  const { className } = props
  return (
    <Wrapper className={className}>
      <div>You should only be able to see this if you are logged in</div>

      <div>
        <Link to="/">Go back</Link>
      </div>
    </Wrapper>
  )
}

export default Protected
