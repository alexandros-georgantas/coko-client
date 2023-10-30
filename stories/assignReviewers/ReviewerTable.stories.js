import React, { useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from 'lodash'

import ReviewerTable from '../../src/ui/assignReviewers/ReviewerTable'
import { DateParser } from '../../src/ui'

const emptyFunc = () => {}

const makeReviewers = n =>
  range(n).map(() => ({
    displayName: faker.person.fullName(),
    id: faker.string.uuid(),
    isSignedUp: true,
    email: faker.internet.email(),
    topics: faker.animal.type(),
    assessmentTraining: Math.random() > 0.5,
    languageTraining: Math.random() > 0.5,
    lastUpdated: faker.date.recent({ days: 180 }),
  }))

export const Base = () => {
  const [reviewers, setReviewers] = useState(makeReviewers(8))

  const onClickRemoveRow = rowId => {
    setReviewers(reviewers.filter(r => r.id !== rowId))
  }

  return (
    <ReviewerTable
      canInviteMore={false}
      onChange={emptyFunc}
      onInvite={emptyFunc}
      onRemoveRow={onClickRemoveRow}
      onRevokeInvitation={emptyFunc}
      reviewers={reviewers}
    />
  )
}

export const Empty = () => {
  return (
    <ReviewerTable
      canInviteMore={false}
      onChange={emptyFunc}
      onInvite={emptyFunc}
      onRemoveRow={emptyFunc}
      onRevokeInvitation={emptyFunc}
    />
  )
}

export const ShowEmails = () => {
  const [reviewers, setReviewers] = useState(makeReviewers(8))

  const onClickRemoveRow = rowId => {
    setReviewers(reviewers.filter(r => r.id !== rowId))
  }

  return (
    <ReviewerTable
      canInviteMore={false}
      onChange={emptyFunc}
      onInvite={emptyFunc}
      onRemoveRow={onClickRemoveRow}
      onRevokeInvitation={emptyFunc}
      reviewers={reviewers}
      showEmails
    />
  )
}

export const AdditionalColumns = () => {
  const [reviewers, setReviewers] = useState(makeReviewers(8))

  const onClickRemoveRow = rowId => {
    setReviewers(reviewers.filter(r => r.id !== rowId))
  }

  const additionalColumns = [
    {
      title: 'Topics',
      dataIndex: 'topics',
    },
    {
      title: 'Assessment Training',
      dataIndex: 'assessmentTraining',
      render: val => (val ? 'Yes' : ''),
      sorter: (a, b) =>
        Number(a.assessmentTraining) - Number(b.assessmentTraining),
    },
    {
      title: 'Language Training',
      dataIndex: 'languageTraining',
      render: val => (val ? 'Yes' : ''),
      sorter: (a, b) => Number(a.languageTraining) - Number(b.languageTraining),
    },
    {
      title: 'Date',
      dataIndex: 'lastUpdated',
      render: val => (
        <DateParser dateFormat="ddd D MMM | HH:mm" timestamp={val.getTime()}>
          {timestamp => timestamp}
        </DateParser>
      ),
      sorter: (a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime(),
      align: 'right',
    },
  ]

  return (
    <ReviewerTable
      additionalColumns={additionalColumns}
      canInviteMore={false}
      onChange={emptyFunc}
      onInvite={emptyFunc}
      onRemoveRow={onClickRemoveRow}
      onRevokeInvitation={emptyFunc}
      reviewers={reviewers}
    />
  )
}

export default {
  component: ReviewerTable,
  title: 'Assign Reviewers/Reviewer List',
}
