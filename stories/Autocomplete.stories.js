import React, { useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from 'lodash'

import { AutoComplete } from '../src/ui'

const makeOptions = n =>
  range(n).map(() => ({
    value: faker.person.fullName(),
  }))

const originalOptions = makeOptions(100)

export const Base = () => {
  const [options, setOptions] = useState(originalOptions)

  const onSearch = searchValue => {
    const regex = new RegExp(searchValue, 'i')

    const newOptions = originalOptions.filter(o => o.value.match(regex))

    setOptions(newOptions)
  }

  return (
    <AutoComplete
      onSearch={onSearch}
      options={options}
      placeholder={faker.lorem.words(4)}
    />
  )
}

export default {
  component: AutoComplete,
  title: 'Common/AutoComplete',
}
