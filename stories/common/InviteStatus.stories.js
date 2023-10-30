import React from 'react'

import { InviteStatus } from '../../src/ui'

export const Base = () => <InviteStatus>some status</InviteStatus>

export const Success = () => (
  <InviteStatus status="success">accepted</InviteStatus>
)
export const Error = () => <InviteStatus status="error">rejected</InviteStatus>
export const Warn = () => (
  <InviteStatus status="warning">watch out</InviteStatus>
)
export const Primary = () => (
  <InviteStatus status="primary">primary</InviteStatus>
)

export const NeutralReverse = () => (
  <InviteStatus reverseColors>neutral</InviteStatus>
)

export const SuccessReverse = () => (
  <InviteStatus reverseColors status="success">
    success
  </InviteStatus>
)

export const ErrorReverse = () => (
  <InviteStatus reverseColors status="error">
    error
  </InviteStatus>
)

export const WarnReverse = () => (
  <InviteStatus reverseColors status="warning">
    watch out
  </InviteStatus>
)

export const PrimaryReverse = () => (
  <InviteStatus reverseColors status="primary">
    primary
  </InviteStatus>
)

export default {
  component: InviteStatus,
  title: 'Common/InviteStatus',
}
