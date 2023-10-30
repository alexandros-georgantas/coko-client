import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@pubsweet/ui-toolkit'

const statuses = {
  success: ['success', 'accept'],
  error: ['error', 'reject'],
  warning: ['warn', 'warning', 'revise'],
  primary: ['primary', 'publish'],
}

const StyledStatus = styled.span`
  background: ${props => {
    const { reverseColors, status } = props
    if (!reverseColors) return null

    if (statuses.success.includes(status)) return th('colorSuccess')
    if (statuses.error.includes(status)) return th('colorError')
    if (statuses.warning.includes(status)) return th('colorWarning')
    if (statuses.primary.includes(status)) return th('colorPrimary')

    return th('colorSecondary')
  }};
  border-radius: 3px;
  color: ${props => {
    const { reverseColors, status } = props
    if (reverseColors) return th('colorTextReverse')

    if (statuses.success.includes(status)) return th('colorSuccess')
    if (statuses.error.includes(status)) return th('colorError')
    if (statuses.warning.includes(status)) return th('colorWarning')
    if (statuses.primary.includes(status)) return th('colorPrimary')

    return th('colorText')
  }};
  display: flex;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBaseSmall')};
  justify-content: space-around;
  line-height: ${th('lineHeightBaseSmall')};
  min-width: ${grid(12)};
  padding: ${props => props.reverseColors && '4px 8px'};
  text-transform: uppercase;
  white-space: normal;
`

const InviteStatus = props => {
  const { children, className, reverseColors, status } = props
  if (!children) return null

  return (
    <StyledStatus
      className={className}
      reverseColors={reverseColors}
      status={status}
    >
      {children}
    </StyledStatus>
  )
}

InviteStatus.propTypes = {
  /** Determines if theme colours are reversed */
  reverseColors: PropTypes.bool,
  /** List of valid status values */
  status: PropTypes.oneOf([
    'success',
    'error',
    'warn',
    'warning',
    'accept',
    'reject',
    'revise',
    'primary',
    'publish',
  ]),
}

InviteStatus.defaultProps = {
  reverseColors: false,
  status: null,
}

export default InviteStatus
