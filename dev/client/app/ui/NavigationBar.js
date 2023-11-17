/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'

import Button from './common/Button'

const StyledNavigationBar = styled.div`
  background: ${props => props.theme.colorPrimary};
  color: white;
  display: flex;
  height: 50px;
  justify-content: space-between;
  line-height: 50px;
  padding: 0 8px;
`

const Username = styled.div`
  margin-right: 10px;
`

const RightSide = styled.div`
  display: flex;
`

const NavigationBar = props => {
  const { login, loginLoading, lulu, logout, currentUsername } = props

  const onClickBtn = () => {
    if (currentUsername) {
      logout()
    } else {
      login()
    }
  }

  const btnText = currentUsername ? 'Logout' : 'Login'

  return (
    <StyledNavigationBar>
      <div>This is the navigation bar</div>

      <div>Connected to lulu? {lulu ? 'yes' : 'no'}</div>

      <RightSide>
        <Username>
          {currentUsername && `Logged in as ${currentUsername}`}
        </Username>

        <div>
          <Button loading={loginLoading} onClick={onClickBtn}>
            {btnText}
          </Button>
        </div>
      </RightSide>
    </StyledNavigationBar>
  )
}

export default NavigationBar
