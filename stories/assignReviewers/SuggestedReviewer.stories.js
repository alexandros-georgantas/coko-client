import React from 'react'
import { faker } from '@faker-js/faker'

import SuggestedReviewer from '../../src/ui/assignReviewers/SuggestedReviewer'

export const Base = () => <SuggestedReviewer name={faker.person.fullName()} />

export default {
  component: SuggestedReviewer,
  title: 'Assign Reviewers/Suggested Reviewer',
}
