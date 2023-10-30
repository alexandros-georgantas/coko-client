/* eslint-disable no-promise-executor-return */
/* eslint-disable no-console */

import React from 'react'

import InviteExternalReviewer from '../../src/ui/assignReviewers/InviteExternalReviewer'

export const Base = () => (
  <InviteExternalReviewer
    onSendInvitation={input => {
      console.log(input)
      return new Promise(resolve => setTimeout(resolve, 2000))
    }}
  />
)

export const Failed = () => (
  <InviteExternalReviewer
    onSendInvitation={vals => {
      return new Promise((resolve, reject) => setTimeout(reject, 2000))
    }}
  />
)

export const Disabled = () => (
  <InviteExternalReviewer
    disabled
    onSendInvitation={vals => console.log(vals)}
  />
)

export default {
  component: InviteExternalReviewer,
  title: 'Assign Reviewers/Invite External Reviewer',
}
