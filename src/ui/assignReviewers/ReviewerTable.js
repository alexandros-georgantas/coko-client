import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table as AntTable } from 'antd'
import { th } from '@pubsweet/ui-toolkit'
import InviteRowProp from './InviteRowProp'

const Wrapper = styled.div`
  border: 1px solid grey;
  padding: 16px;
`

const EmptyMessage = styled.div`
  color: ${th('colorTextPlaceholder')};
  font-size: ${th('fontSizeBaseSmall')};
  font-style: italic;
`

const StyledTable = styled(AntTable)``

const ReviewerTable = props => {
  const {
    additionalColumns,
    canInviteMore,
    className,
    onChange,
    onInvite,
    onRemoveRow,
    onRevokeInvitation,
    reviewers,
    showEmails,
  } = props

  if (reviewers.length === 0) {
    return (
      <Wrapper className={className}>
        <EmptyMessage>No reviewers have been added to the list</EmptyMessage>
      </Wrapper>
    )
  }

  const handleChange = (pagination, filters, sorter, extra) => {
    onChange(extra.currentDataSource)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'displayName',
      sorter: (a, b) =>
        a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '',
      dataIndex: 'inviteStatus',
      render: (text, rowData) => (
        <InviteRowProp className={className} data={rowData} type="status" />
      ),
    },
    ...(showEmails
      ? [
          {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) =>
              a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
            sortDirections: ['ascend', 'descend'],
          },
        ]
      : []),
    ...additionalColumns,
    {
      title: '',
      dataIndex: 'inviteAction',
      render: (text, rowData) => (
        <InviteRowProp
          canInvite={canInviteMore}
          className={className}
          data={rowData}
          onClickInvite={onInvite}
          onClickRevokeInvitation={onRevokeInvitation}
          type="action"
        />
      ),
      align: 'right',
    },
    {
      title: '',
      dataIndex: 'removeRow',
      render: (text, rowData) => (
        <InviteRowProp
          canInvite={canInviteMore}
          className={className}
          data={rowData}
          onClickRemove={onRemoveRow}
          type="remove"
        />
      ),
    },
  ]

  const rows = reviewers.map(r => ({ ...r, key: r.id }))

  return (
    <Wrapper className={className}>
      <StyledTable
        columns={columns}
        dataSource={rows}
        onChange={handleChange}
      />
    </Wrapper>
  )
}

ReviewerTable.propTypes = {
  /** Column definitions of type `ColumnsType` from `antd/es/table` */
  additionalColumns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
    }),
  ),
  /** Whether more reviewers can be invited */
  canInviteMore: PropTypes.bool.isRequired,
  /** Function to run when data is filtered/sorted */
  onChange: PropTypes.func.isRequired,
  /** Function to run when "invite" is clicked on a row from the pool */
  onInvite: PropTypes.func.isRequired,
  /** Function to run when the "X" button is clicked on a row from the pool */
  onRemoveRow: PropTypes.func.isRequired,
  /** Function to run when "revoke invitation" is clicked on a row from the pool */
  onRevokeInvitation: PropTypes.func.isRequired,
  /** List of reviewers */
  reviewers: PropTypes.arrayOf(
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
  /** Shorthand flag to indicate if the emails should be shown */
  showEmails: PropTypes.bool,
}

ReviewerTable.defaultProps = {
  additionalColumns: [],
  reviewers: [],
  showEmails: false,
}

export default ReviewerTable
