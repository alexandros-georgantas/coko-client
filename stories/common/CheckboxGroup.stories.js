import React from 'react'
import { faker } from '@faker-js/faker'

import { range } from 'lodash'

import { CheckboxGroup } from '../../src/ui'

const makeOptions = n =>
  range(n).map(i => ({
    value: i,
    label: faker.lorem.words(3),
  }))

const options = makeOptions(4)

export const Base = () => <CheckboxGroup options={options} />

export const Vertical = () => <CheckboxGroup options={options} vertical />

export const DisabledOptions = () => {
  const optionsWithDisabled = makeOptions(5)
  optionsWithDisabled[1].disabled = true
  optionsWithDisabled[2].disabled = true

  return <CheckboxGroup options={optionsWithDisabled} vertical />
}

export default {
  component: CheckboxGroup,
  title: 'Common/CheckboxGroup',
}
