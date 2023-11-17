import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Spin, Result } from '../common'

const Wrapper = styled.div``

const ProviderConnection = props => {
  const {
    className,
    closeOnSuccess,
    connecting,
    redirectUrlLabel,
    successfullyConnected,
  } = props

  let resultProps

  if (connecting) {
    resultProps = {
      icon: <Spin size={18} spinning />,
      title: 'Authenticating...',
    }
  } else if (successfullyConnected) {
    let nextPageSubTitle = ''

    if (closeOnSuccess) {
      nextPageSubTitle = 'This window should close automatically...'
    } else if (redirectUrlLabel) {
      nextPageSubTitle = `Redirecting you to ${redirectUrlLabel}...`
    } else {
      nextPageSubTitle = 'Redirecting you...'
    }

    resultProps = {
      status: 'success',
      subTitle: nextPageSubTitle,
      title: 'Connection established!',
    }
  } else {
    // Connection must have failed
    resultProps = {
      status: 'error',
      subTitle: 'Try reconnecting or contact us',
      title: 'Something went wrong!',
    }
  }

  return (
    <Wrapper className={className}>
      <Result {...resultProps} />
    </Wrapper>
  )
}

ProviderConnection.propTypes = {
  closeOnSuccess: PropTypes.bool,
  connecting: PropTypes.bool,
  redirectUrlLabel: PropTypes.string,
  successfullyConnected: PropTypes.bool,
}

ProviderConnection.defaultProps = {
  closeOnSuccess: false,
  connecting: false,
  redirectUrlLabel: null,
  successfullyConnected: false,
}

export default ProviderConnection
