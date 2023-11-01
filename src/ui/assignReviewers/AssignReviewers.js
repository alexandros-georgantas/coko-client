import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@pubsweet/ui-toolkit'

import InviteExternalReviewer from './InviteExternalReviewer'
import SearchBox from './SearchBox'
import SuggestedReviewer from './SuggestedReviewer'
import { Button, Checkbox, NumberInput, Ribbon } from '../common'
import ReviewerTable from './ReviewerTable'

const Wrapper = styled.div``

const Separator = styled.div`
  border-bottom: 2px solid ${th('colorPrimary')};
  margin: ${grid(5)} ${grid(3)};
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${grid(3)};

  label:last-of-type {
    margin-top: 0;
  }
`

const ItemWrapper = styled.div``

const InviteExternalReviewerWrapper = styled.div``

const Head = styled.div`
  margin-bottom: ${grid(1)};
`

const HeadSecondRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  > div > button:not(:last-child) {
    margin-right: ${grid(1)};
  }
`

const Search = styled(SearchBox)`
  margin-bottom: ${grid(1)};
`

const StyledRibbon = styled(Ribbon)`
  margin-bottom: ${grid(1)};
`

const AssignReviewers = props => {
  const {
    additionalReviewerColumns,
    additionalSearchFields,
    amountOfReviewers,
    automate,
    canInviteMore,
    className,
    onAddExternalReviewer,
    onAddReviewers,
    onAmountOfReviewersChange,
    onClickInvite,
    onClickRemoveRow,
    onClickRevokeInvitation,
    onClickStart,
    onClickStop,
    onSearch,
    onTableChange,
    reviewerPool,
    suggestedReviewerName,
    useInviteExternalReviewer,
    useShowEmail,
  } = props

  const [showEmails, setShowEmails] = useState(false)

  // Explainer text: Adding reviewers to the list won't send them an invite yet
  return (
    <Wrapper className={className}>
      {(suggestedReviewerName || useShowEmail) && (
        <Top>
          <ItemWrapper>
            {suggestedReviewerName && (
              <SuggestedReviewer name={suggestedReviewerName} />
            )}
          </ItemWrapper>
          <ItemWrapper>
            {useShowEmail && (
              <Checkbox
                checked={showEmails}
                onChange={() => setShowEmails(!showEmails)}
              >
                Show reviewer emails
              </Checkbox>
            )}
          </ItemWrapper>
        </Top>
      )}

      <Search
        additionalSearchFields={additionalSearchFields}
        onAdd={onAddReviewers}
        onSearch={onSearch}
      />

      <Head>
        <StyledRibbon status={automate ? 'success' : null}>
          Automation is {automate ? 'on' : 'off'}
        </StyledRibbon>

        <HeadSecondRow>
          <ItemWrapper>
            <Button disabled={automate} onClick={onClickStart} type="primary">
              Start
            </Button>
            <Button disabled={!automate} onClick={onClickStop} type="primary">
              Stop
            </Button>
          </ItemWrapper>

          <NumberInput
            disabled={automate}
            label="Maximum reviewers from pool"
            onChange={onAmountOfReviewersChange}
            value={amountOfReviewers}
          />
        </HeadSecondRow>
      </Head>

      <ReviewerTable
        additionalColumns={additionalReviewerColumns}
        canInviteMore={canInviteMore}
        onChange={onTableChange}
        onInvite={onClickInvite}
        onRemoveRow={onClickRemoveRow}
        onRevokeInvitation={onClickRevokeInvitation}
        reviewers={reviewerPool}
        showEmails={showEmails}
      />

      {useInviteExternalReviewer && (
        <InviteExternalReviewerWrapper>
          <Separator />

          <InviteExternalReviewer
            disabled={!canInviteMore}
            onSendInvitation={onAddExternalReviewer}
          />
        </InviteExternalReviewerWrapper>
      )}
    </Wrapper>
  )
}

AssignReviewers.propTypes = {
  /** Additional column definitions of type `ColumnsType` from `antd/es/table` */
  additionalReviewerColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
    }),
  ),
  /** Additional search fields definitions to display on search */
  additionalSearchFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  /** Maximum amount of reviewers that can be invited at the same time */
  amountOfReviewers: PropTypes.number.isRequired,
  /** Whether reviewer invitation automation is on for this manuscript version */
  automate: PropTypes.bool.isRequired,
  /** Whether more reviewers can be invited */
  canInviteMore: PropTypes.bool.isRequired,
  /** Function that sends invitation to non-signed up users. Must return a promise. */
  onAddExternalReviewer: PropTypes.func,
  /** Function to run on selecting a reviewer in the search box */
  onAddReviewers: PropTypes.func.isRequired,
  /** Handle change in amount of reviewers input */
  onAmountOfReviewersChange: PropTypes.func.isRequired,
  /** Function to run when "invite" is clicked on a row from the pool */
  onClickInvite: PropTypes.func.isRequired,
  /** Function to run when the "X" button is clicked on a row from the pool */
  onClickRemoveRow: PropTypes.func.isRequired,
  /** Function to run when "revoke invitation" is clicked on a row from the pool */
  onClickRevokeInvitation: PropTypes.func.isRequired,
  /** Function to run when "start automation" is clicked */
  onClickStart: PropTypes.func.isRequired,
  /** Function to run when "stop automation" is clicked */
  onClickStop: PropTypes.func.isRequired,
  /** Function that returns a promise. Must resolve to an array objects, each with shape `{ value: <String>, label: <String>, isDisabled: <Boolean>, status: <String>}` */
  onSearch: PropTypes.func.isRequired,
  /** Function to run when data is filtered/sorted */
  onTableChange: PropTypes.func.isRequired,
  /** Reviewers added to the pool list. Shape defined in ReviewerRow */
  reviewerPool: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      invited: PropTypes.bool,
      acceptedInvitation: PropTypes.bool,
      rejectedInvitation: PropTypes.bool,
      invitationRevoked: PropTypes.bool,
      reviewSubmitted: PropTypes.bool,
    }),
  ),
  /** Display name of suggested reviewer */
  suggestedReviewerName: PropTypes.string,
  /** Whether to display the option to show `Show reviewer emails` checkbox.
   * Alternatively, the email renders can be customised using `additionalReviewerColumns`  */
  useShowEmail: PropTypes.bool,
  /** Whether to display the `InviteExternalReviewer` functionality */
  useInviteExternalReviewer: PropTypes.bool,
}

AssignReviewers.defaultProps = {
  additionalReviewerColumns: [],
  additionalSearchFields: [],
  onAddExternalReviewer: () => {},
  reviewerPool: [],
  suggestedReviewerName: null,
  useShowEmail: false,
  useInviteExternalReviewer: false,
}

export default AssignReviewers
