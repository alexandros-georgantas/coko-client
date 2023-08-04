import React, { useState } from 'react'
import { faker } from '@faker-js/faker'

import { Switch } from '../../src/ui'

export const Base = () => {
  const [checked, setChecked] = useState(false)
  const handleChange = () => setChecked(!checked)

  return <Switch checked={checked} onChange={handleChange} />
}

export const WithLabel = () => <Switch label={faker.lorem.words(5)} />

export const WithLabelLeft = () => (
  <Switch label={faker.lorem.words(5)} labelPosition="left" />
)

export default {
  component: Switch,
  title: 'Common/Switch',
}
