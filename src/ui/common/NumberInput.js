import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { InputNumber } from 'antd'
import { grid } from '@pubsweet/ui-toolkit'

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

const Input = styled(InputNumber)`
  width: ${grid(8)};
`

const NumberInput = props => {
  const { className, disabled, label, max, min, name, onChange, value } = props

  return (
    <Wrapper className={className} isDisabled={disabled}>
      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
      <label htmlFor={name}>
        <Label>{label}</Label>

        <Input
          disabled={disabled}
          max={max}
          min={min}
          name={name}
          onChange={onChange}
          type="number"
          value={value}
        />
      </label>
    </Wrapper>
  )
}

NumberInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string,
}

NumberInput.defaultProps = {
  disabled: false,
  label: null,
  max: null,
  min: 1,
  name: 'number-input',
}

export default NumberInput
