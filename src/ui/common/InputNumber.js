import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { InputNumber as AntInputNumber } from 'antd'
import { grid } from '../../toolkit'

const Wrapper = styled.div`
  cursor: ${props => (props.isDisabled ? 'not-allowed' : 'default')};
  display: inline;
  opacity: ${props => (props.isDisabled ? '0.5' : '1')};

  label,
  input {
    cursor: ${props => (props.isDisabled ? 'not-allowed' : 'default')};
  }
`

const Label = styled.span`
  margin-right: ${grid(1)};
`

const Input = styled(AntInputNumber)`
  width: ${grid(8)};
`

const InputNumber = props => {
  const { className, disabled, label, name, ...rest } = props

  return (
    <Wrapper className={className} isDisabled={disabled}>
      <label htmlFor={name}>
        <Label>{label}</Label>
        <Input disabled={disabled} name={name} {...rest} />
      </label>
    </Wrapper>
  )
}

InputNumber.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
}

InputNumber.defaultProps = {
  disabled: false,
  label: null,
  name: 'number-input',
}

export default InputNumber
