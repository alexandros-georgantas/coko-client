import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table as AntTable } from 'antd'

import { MenuOutlined } from '@ant-design/icons'
import { DndContext } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

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

const Row = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props['data-row-key'],
  })

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      },
    ),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9999,
        }
      : {}),
  }

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, child => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move',
                }}
                {...listeners}
              />
            ),
          })
        }

        return child
      })}
    </tr>
  )
}

Row.propTypes = {
  'data-row-key': PropTypes.string.isRequired,
  style: PropTypes.shape().isRequired,
}

const ReviewerTable = props => {
  const {
    additionalColumns,
    canInviteMore,
    className,
    manualSorting,
    onChange,
    onInvite,
    onRemoveRow,
    onRevokeInvitation,
    reviewers,
    showEmails,
  } = props

  const [tableSorter, setTableSorter] = useState({})

  useEffect(() => {
    setTableSorter(manualSorting ? {} : tableSorter)
  }, [manualSorting])

  useEffect(() => {}, [tableSorter])

  if (reviewers.length === 0) {
    return (
      <Wrapper className={className}>
        <EmptyMessage>No reviewers have been added to the list</EmptyMessage>
      </Wrapper>
    )
  }

  const handleChange = (pagination, filters, sorter, extra) => {
    onChange(extra.currentDataSource)
    setTableSorter(manualSorting ? {} : sorter)
  }

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      onChange(previous => {
        const activeIndex = previous.findIndex(i => i.id === active.id)
        const overIndex = previous.findIndex(i => i.id === over?.id)
        return arrayMove(previous, activeIndex, overIndex)
      })
    }
  }

  const columns = [
    ...(manualSorting
      ? [
          {
            key: 'sort',
          },
        ]
      : []),
    {
      title: 'Name',
      dataIndex: 'displayName',
      key: 'displayName',
      sorter: (a, b) =>
        a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: '',
      dataIndex: 'inviteStatus',
      key: 'inviteStatus',
      render: (text, rowData) => (
        <InviteRowProp className={className} data={rowData} type="status" />
      ),
    },
    ...(showEmails
      ? [
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
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
      key: 'inviteAction',
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
      key: 'removeRow',
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
  ].map(col => {
    // if (manualSorting) {
    //   //   const { sorter, ...rest } = col
    //   return {
    //     ...col,
    //     sortOrder: tableSorter.columnKey === col.dataIndex && tableSorter.order,
    //   }
    // }

    // return col

    if (manualSorting) {
      const { sorter, ...rest } = col
      return {
        ...rest,
        // sorter,
        sortOrder: false,
        // sortOrder: tableSorter.columnKey === col.dataIndex && tableSorter.order,
      }
    }

    return {
      ...col,
      sortOrder: tableSorter.columnKey === col.key && tableSorter.order,
    }
  })

  const rows = reviewers.map(r => ({ ...r, key: r.id }))

  return (
    <Wrapper className={className}>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={rows.map(r => r.key)}
          strategy={verticalListSortingStrategy}
        >
          <StyledTable
            columns={columns}
            components={{
              body: {
                row: Row,
              },
            }}
            dataSource={rows}
            key={`manual-sorting-${manualSorting}`}
            onChange={handleChange}
            pagination={false}
            rowKey="key"
          />
        </SortableContext>
      </DndContext>
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
  /** Enable drag and drop, but also disable auto-sorted columns */
  manualSorting: PropTypes.bool,
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
  manualSorting: false,
  reviewers: [],
  showEmails: false,
}

export default ReviewerTable
