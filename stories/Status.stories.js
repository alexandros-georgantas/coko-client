import React from 'react'

import { Status } from '../src/ui'

export const NotSubmitted = () => <Status status="Not Submitted" />
export const Submitted = () => <Status status="Submitted" />
export const Rejected = () => <Status status="Rejected" />
export const UnderReview = () => <Status status="Under Review" />
export const InProduction = () => <Status status="In Production" />
export const Published = () => <Status status="Published" />

export default {
  component: Status,
  title: 'Common/Status',
}
