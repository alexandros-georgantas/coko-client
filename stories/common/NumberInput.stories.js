import React, { useState } from 'react'
// import { lorem } from 'faker'

import { NumberInput } from '../../src/ui'

export const Base = () => {
  const [value, setValue] = useState(2)

  return (
    <NumberInput
      label="Choose a number"
      onChange={val => setValue(val)}
      value={value}
    />
  )
}

export const Disabled = () => (
  <NumberInput disabled label="Choose a number" onChange={() => {}} value={3} />
)

export default {
  component: NumberInput,
  title: 'Common/NumberInput',
}
