import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { CloseOutlined } from '@ant-design/icons'

import { Button, InviteStatus } from '../common'

const StyledInviteStatus = styled(InviteStatus)`
  font-size: 12px;
  margin: 0 4px;
  max-width: 32px;
`

const InviteStatusWrapper = styled.div`
  display: inline-block;
`

const InviteActionWrapper = styled.div``

const RemoveInviteWrapper = styled.div`
  &:hover {
    cursor: pointer;
  }
`

const InviteRowProp = props => {
  const {
    canInvite,
    className,
    data,
    onClickInvite,
    onClickRemove,
    onClickRevokeInvitation,
    type,
  } = props

  const {
    id,
    invited,
    acceptedInvitation,
    rejectedInvitation,
    invitationRevoked,
    reviewSubmitted,
  } = data

  const reviewPending = invited && acceptedInvitation && !reviewSubmitted
  const submitted = invited && acceptedInvitation && reviewSubmitted
  const rejected = invited && rejectedInvitation
  const revoked = invited && invitationRevoked

  const responsePending =
    invited && !invitationRevoked && !acceptedInvitation && !rejectedInvitation

  const notInvited = !invited && !invitationRevoked

  const makeStatusText = () => {
    if (reviewPending) return 'accepted invitation - pending review'
    if (submitted) return 'review submitted'
    if (rejected) return 'rejected invitation'
    if (revoked) return 'invitation revoked'
    if (responsePending) return 'invited'
    if (notInvited) return 'not invited'
    return null
  }

  const makeStatus = () => {
    if (reviewPending) return 'success'
    if (submitted) return 'primary'
    if (rejected) return 'error'
    if (revoked) return 'error'
    if (responsePending) return 'success'
    if (notInvited) return null
    return null
  }

  const handleRemove = () => {
    onClickRemove(id)
  }

  if (type === 'status') {
    return (
      <InviteStatusWrapper className={className}>
        <StyledInviteStatus reverseColors status={makeStatus()}>
          {makeStatusText()}
        </StyledInviteStatus>
      </InviteStatusWrapper>
    )
  }

  if (type === 'action') {
    return (
      <InviteActionWrapper className={className}>
        {notInvited && (
          <Button
            disabled={!canInvite}
            onClick={() => onClickInvite(id)}
            type="primary"
          >
            Invite
          </Button>
        )}

        {revoked && (
          <Button
            disabled={!canInvite}
            onClick={() => onClickInvite(id)}
            type="primary"
          >
            Reinvite
          </Button>
        )}

        {responsePending && (
          <Button onClick={() => onClickRevokeInvitation(id)} type="primary">
            Revoke invite
          </Button>
        )}
      </InviteActionWrapper>
    )
  }

  if (type === 'remove' && notInvited) {
    return (
      <RemoveInviteWrapper className={className} onClick={handleRemove}>
        <CloseOutlined />
      </RemoveInviteWrapper>
    )
  }

  return null
}

InviteRowProp.propTypes = {
  /** Whether more reviewers can be invited */
  canInvite: PropTypes.bool,
  /** Current row's invite status fields */
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    invited: PropTypes.bool,
    acceptedInvitation: PropTypes.bool,
    rejectedInvitation: PropTypes.bool,
    invitationRevoked: PropTypes.bool,
    reviewSubmitted: PropTypes.bool,
  }).isRequired,

  /** Function to run when "invite" is clicked on a row from the pool */
  onClickInvite: PropTypes.func,
  /** Function to run when the  "X" is clicked on a row from the pool */
  onClickRemove: PropTypes.func,
  /** Function to run when "Revoke invitiation" is clicked on a row from the pool */
  onClickRevokeInvitation: PropTypes.func,
  /** Type of invite prop being rendered */
  type: PropTypes.string.isRequired,
}

InviteRowProp.defaultProps = {
  canInvite: false,
  onClickInvite: () => {},
  onClickRemove: () => {},
  onClickRevokeInvitation: () => {},
}

export default InviteRowProp
