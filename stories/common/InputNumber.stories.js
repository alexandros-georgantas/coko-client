import React, { useState } from 'react'
// import { lorem } from 'faker'

import { InputNumber } from '../../src/ui'

export const Base = () => {
  const [value, setValue] = useState(2)

  return (
    <InputNumber
      label="Choose a number"
      onChange={val => setValue(val)}
      value={value}
    />
  )
}

export const Disabled = () => (
  <InputNumber disabled label="Choose a number" onChange={() => {}} value={3} />
)

export default {
  component: InputNumber,
  title: 'Common/InputNumber',
}
