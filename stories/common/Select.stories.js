import React, { useState } from 'react'
import { faker } from '@faker-js/faker'
import { range } from 'lodash'

import { Select } from '../../src/ui'

const makeOptions = n =>
  range(n).map(i => ({
    label: faker.person.fullName(),
    value: faker.string.uuid(),
  }))

const makeLongOptions = n =>
  range(n).map(i => ({
    label: faker.lorem.sentences(5),
    value: faker.string.uuid(),
  }))

const options = makeOptions(10)

const groupedOptions = [
  {
    label: 'Winners',
    options: makeOptions(4),
  },
  {
    label: 'Losers',
    options: makeOptions(4),
  },
]

const longOptions = makeLongOptions(10)

export const Base = () => (
  <Select options={options} placeholder={faker.lorem.words(4)} />
)

export const WithGroups = () => (
  <Select options={groupedOptions} placeholder={faker.lorem.words(4)} />
)

export const Multi = () => (
  <Select
    mode="multiple"
    options={options}
    placeholder={faker.lorem.words(4)}
  />
)

export const Async = () => {
  const [loading, setLoading] = useState(false)
  const [optionsData, setOptionsData] = useState([])

  const handleSearch = searchValue => {
    setLoading(true)

    setTimeout(() => {
      setOptionsData(makeOptions(5))
      setLoading(false)
    }, 500)
  }

  return (
    <Select
      async
      loading={loading}
      mode="multiple"
      onSearch={handleSearch}
      options={optionsData}
      placeholder={faker.lorem.words(4)}
      // showSearch
    />
  )
}

export const WrapOptionText = () => (
  <Select
    options={longOptions}
    placeholder="Very long text options, sentence will be wrapped and option element will increase in height"
    wrapOptionText
  />
)

export default {
  component: Select,
  title: 'Common/Select',
}
