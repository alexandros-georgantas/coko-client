import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { range, uniq } from 'lodash'
import { faker } from '@faker-js/faker'
import { grid } from '@pubsweet/ui-toolkit'

import AssignReviewers from '../../src/ui/assignReviewers/AssignReviewers'
import { Note } from '../../src/ui'

const Wrapper = styled.div`
  margin-bottom: 100px;
`

const StyledNote = styled(Note)`
  margin-bottom: ${grid(2)};
`

const Separator = styled.div`
  border-bottom: 2px solid gray;
  margin: 32px 0;
`

const ButtonsWrapper = styled.div`
  > button {
    margin-right: 4px;
  }
`

const makeReviewers = n =>
  range(n).map(() => ({
    displayName: faker.person.fullName(),
    email: faker.internet.email(),
    id: faker.string.uuid(),
    invited: false,
    invitationRevoked: false,
    isSignedUp: true,
    acceptedInvitation: false,
    rejectedInvitation: false,
    reviewSubmitted: false,
    topics: faker.animal.type(),
    assessmentTraining: Math.random() > 0.5,
    languageTraining: Math.random() > 0.5,
    lastUpdated: faker.date.recent({ days: 180 }),
  }))

const suggestedReviewer = faker.person.fullName()

const isActive = r => r.invited && !r.invitationRevoked && !r.rejectedInvitation

const isAvailable = r => !r.invited

const topics = uniq(range(20).map(() => faker.animal.type()))

const additionalSearchFields = [
  {
    label: 'Assessment Training',
    value: 'assessmentTraining',
  },
  {
    label: 'Language Training',
    value: 'languageTraining',
  },
  {
    label: 'Topics',
    value: 'topics',
    items: topics,
  },
]

const Template = args => {
  const [reviewers, setReviewers] = useState(makeReviewers(40))
  const [pool, setPool] = useState(makeReviewers(8))
  const [sortedPool, setSortedPool] = useState([])
  const [automation, setAutomation] = useState(false)
  const [amountOfReviewers, setAmountOfReviewers] = useState(2)

  useEffect(() => {
    setSortedPool(pool)
  }, [pool])

  const handleAddReviewers = optionsClicked => {
    const newReviewers = optionToReviewerData(optionsClicked)
    setPool([...pool, ...newReviewers])
    setReviewers(
      reviewers.filter(r => !newReviewers.map(nr => nr.id).includes(r.id)),
    )

    return Promise.resolve()
  }

  const handleClickRemoveRow = rowId => {
    const item = pool.find(r => r.id === rowId)
    setPool(pool.filter(r => r.id !== rowId))
    setReviewers([item, ...reviewers])
  }

  const findAvailableSlots = () => {
    const active = pool.filter(r => isActive(r))
    const reviewerSlotsLeft = amountOfReviewers - active.length

    if (reviewerSlotsLeft < 0) return 0
    return reviewerSlotsLeft
  }

  const canInviteMore = () => {
    const available = findAvailableSlots()
    return available > 0
  }

  const runAutomation = () => {
    const reviewerSlotsLeft = findAvailableSlots()

    // invite as many as allowed
    const notInvited = sortedPool.filter(r => isAvailable(r))

    const reviewerIdsToInvite = notInvited
      .slice(0, reviewerSlotsLeft)
      .map(r => r.id)

    const poolClone = [...pool]

    reviewerIdsToInvite.forEach(id => {
      const obj = poolClone.find(i => i.id === id)
      const index = poolClone.indexOf(obj)
      obj.invited = true
      poolClone[index] = obj
    })

    setPool(poolClone)
  }

  const handleAmountOfReviewersChange = value => {
    setAmountOfReviewers(value)
  }

  const handleClickInvite = reviewerId => {
    if (!canInviteMore()) return

    const poolClone = [...pool]
    const reviewer = poolClone.find(r => r.id === reviewerId)

    // reinvited
    if (reviewer.invited && reviewer.invitationRevoked) {
      reviewer.invitationRevoked = false
    } else {
      reviewer.invited = true
    }

    setPool(poolClone)
  }

  const handleClickRevokeInvitation = reviewerId => {
    const poolClone = [...pool]
    const reviewer = poolClone.find(r => r.id === reviewerId)
    reviewer.invitationRevoked = true
    setPool(poolClone)

    if (automation) runAutomation()
  }

  const handleRejectInvitation = () => {
    const poolClone = [...pool]

    const reviewer = poolClone.find(
      r =>
        r.invited &&
        !r.acceptedInvitation &&
        !r.rejectedInvitation &&
        !r.invitationRevoked,
    )

    if (!reviewer) return

    reviewer.rejectedInvitation = true
    setPool(poolClone)

    if (automation) runAutomation()
  }

  const handleAcceptInvitation = () => {
    const poolClone = [...pool]

    const reviewer = poolClone.find(
      r =>
        r.invited &&
        !r.acceptedInvitation &&
        !r.rejectedInvitation &&
        !r.invitationRevoked,
    )

    if (!reviewer) return

    reviewer.acceptedInvitation = true
    setPool(poolClone)

    if (automation) runAutomation()
  }

  const handleSubmitReview = () => {
    const poolClone = [...pool]

    const reviewer = poolClone.find(
      r => r.acceptedInvitation && !r.reviewSubmitted,
    )

    if (!reviewer) return

    reviewer.reviewSubmitted = true
    setPool(poolClone)

    if (automation) runAutomation()
  }

  const resetState = () => {
    setReviewers(makeReviewers(10))
    setPool(makeReviewers(8))
    setAutomation(false)
  }

  const handleAutomationChange = toAutomate => {
    setAutomation(toAutomate)

    if (toAutomate) {
      runAutomation()
    }
  }

  const reviewerDataToOption = reviewer => ({
    ...reviewer,
    label: reviewer.displayName,
    value: reviewer.id,
  })

  const optionToReviewerData = options =>
    reviewers.filter(r => options.includes(r.id))

  const handleSearch = input =>
    new Promise(resolve => {
      setTimeout(() => {
        if (!input) {
          resolve([])
        }

        const lowerCaseInput = input.toLowerCase()

        const results = reviewers
          .filter(person => {
            if (person.displayName.toLowerCase().includes(lowerCaseInput)) {
              return true
            }

            let foundMatchingField = false

            additionalSearchFields.forEach(field => {
              if (
                field.label.toLocaleLowerCase().includes(lowerCaseInput) &&
                typeof person[field.value] === 'boolean' &&
                person[field.value]
              ) {
                foundMatchingField = true
              } else if (
                person[field.value] &&
                Array.isArray(person[field.value])
              ) {
                person[field.value].forEach(entry => {
                  if (entry.toLowerCase().includes(lowerCaseInput)) {
                    foundMatchingField = true
                  }
                })
              }
            })

            return foundMatchingField
          })
          .map(reviewer => reviewerDataToOption(reviewer))

        resolve(results)
      }, 1000)
    })

  return (
    <Wrapper>
      <StyledNote>
        Add reviewers to the pool and order them by preference via drag and
        drop. Starting the automation will invite the first {amountOfReviewers}{' '}
        reviewers it finds from the top of the list that are available. While
        automation is on, revoking or rejecting an invitation will move to find
        a new reviewer. You can also invite or revoke invitations manually, as
        long as you are allowed to (eg. cannot invite more than{' '}
        {amountOfReviewers} reviewers). Automation can be turned off at any
        point. The buttons below simulate what would happen for certain events
        that would be triggered server-side. The reset button will bring this
        demo to its original state with new data.
      </StyledNote>

      <ButtonsWrapper>
        <button onClick={handleAcceptInvitation} type="button">
          Reviewer accepts invitation
        </button>

        <button onClick={handleRejectInvitation} type="button">
          Reviewer rejects invitation
        </button>

        <button onClick={handleSubmitReview} type="button">
          Reviewer submits review
        </button>

        <button onClick={resetState} type="button">
          Reset state
        </button>
      </ButtonsWrapper>

      <Separator />

      <AssignReviewers
        {...args}
        amountOfReviewers={amountOfReviewers}
        automate={automation}
        canInviteMore={canInviteMore()}
        onAddReviewers={handleAddReviewers}
        onAmountOfReviewersChange={handleAmountOfReviewersChange}
        onAutomationChange={handleAutomationChange}
        onClickInvite={handleClickInvite}
        onClickRemoveRow={handleClickRemoveRow}
        onClickRevokeInvitation={handleClickRevokeInvitation}
        onSearch={handleSearch}
        onTableChange={setPool}
        reviewerPool={pool}
      />
    </Wrapper>
  )
}

const commonArgs = {
  useShowEmail: true,
  suggestedReviewerName: suggestedReviewer,
}

export const Base = Template.bind({})

Base.args = {
  ...commonArgs,
}

export default {
  component: AssignReviewers,
  title: 'Assign Reviewers/Assign Reviewers',
}
