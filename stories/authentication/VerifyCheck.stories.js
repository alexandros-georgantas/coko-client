import React from 'react'

import { VerifyCheck } from '../../src/ui'

export const Base = () => <VerifyCheck />
export const Resending = () => <VerifyCheck resending />
export const Resent = () => <VerifyCheck resent />

export default {
  component: VerifyCheck,
  title: 'Authentication/VerifyCheck',
}
